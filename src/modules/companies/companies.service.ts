import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { Repository } from 'typeorm';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { DeliveryPoint } from '../delivery_points/delivery-points.entity';

@Injectable()
export class CompaniesService {
  constructor(@InjectRepository(Company) private companyRepository: Repository<Company>) {}

  async findAll(page: number = 1, limit: number = 10, keyword?: string) {
    const skip = (page - 1) * limit;

    const queryBuilder = this.companyRepository
      .createQueryBuilder('company')
      // .leftJoinAndSelect('company.deliveryPoints', 'deliveryPoint')
      .orderBy('company.id', 'ASC')
      .addOrderBy('company.name', 'ASC');

    if (keyword) {
      queryBuilder.where(
        'company.name ILIKE :keyword OR company.address ILIKE :keyword OR company.city ILIKE :keyword OR company.email ILIKE :keyword',
        { keyword: `%${keyword}%` },
      );
    }

    const [companies, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: companies,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async create(createCompanyDto: CreateCompanyDto) {
    const existing = await this.companyRepository.findOne({ where: { name: createCompanyDto.name } });
    if (existing) throw new BadRequestException('Company name already exists.');

    const { deliveryPoints, ...companyData } = createCompanyDto;
    const newCompany = this.companyRepository.create({
      ...companyData,
      deliveryPoints: deliveryPoints?.map((dp) =>
        this.companyRepository.manager.create(DeliveryPoint, {
          ...dp,
        }),
      ),
    });

    return this.companyRepository.save(newCompany);
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.companyRepository.findOne({
      where: { id },
      relations: ['deliveryPoints'],
    });
    if (!company) throw new BadRequestException('Company not found.');

    const { deliveryPoints, ...companyData } = updateCompanyDto;
    Object.assign(company, companyData);

    if (deliveryPoints) {
      const incomingIds = deliveryPoints.map((dp) => dp.id).filter((id) => !!id);
      const toRemove = company.deliveryPoints.filter((dp) => !incomingIds.includes(dp.id));

      if (toRemove.length > 0) await this.companyRepository.manager.remove(toRemove);

      company.deliveryPoints = deliveryPoints.map((dp) =>
        this.companyRepository.manager.create(DeliveryPoint, {
          ...dp,
          company,
        }),
      );
    }

    return this.companyRepository.save(company);
  }

  async delete(id: number) {
    const company = await this.companyRepository.findOne({ where: { id } });
    if (!company) throw new BadRequestException('Company not found.');

    await this.companyRepository.delete(id);
    return { message: `Company with id ${id} has been deleted.` };
  }
}
