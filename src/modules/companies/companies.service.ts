import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { Repository } from 'typeorm';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(@InjectRepository(Company) private companyRepository: Repository<Company>) {}

  async findAll(page: number = 1, limit: number = 10, keyword?: string) {
    const skip = (page - 1) * limit;

    const queryBuilder = this.companyRepository
      .createQueryBuilder('company')
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

    const newCompany = this.companyRepository.create(createCompanyDto);
    return this.companyRepository.save(newCompany);
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.companyRepository.findOne({ where: { id } });
    if (!company) throw new BadRequestException('Company not found.');

    Object.assign(company, updateCompanyDto);
    return this.companyRepository.save(company);
  }

  async delete(id: number) {
    const company = await this.companyRepository.findOne({ where: { id } });
    if (!company) throw new BadRequestException('Company not found.');

    await this.companyRepository.remove(company);
    return { message: `Company with id ${id} has been deleted.` };
  }
}
