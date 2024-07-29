import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

// SAMPLE ENTITY FOR BOILERPLATES ONLY
// PLEASE REMEMBER TO REMOVE THIS ENTITY WHEN YOU START ADDING YOUR OWN ENTITIES
@Entity()
export class SampleEntity extends BaseEntity{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
}