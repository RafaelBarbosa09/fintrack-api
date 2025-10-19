type CategoryProps = {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt?: Date;
};

export class Category {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt?: Date;

  private constructor(props: CategoryProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(
    props: Omit<CategoryProps, 'id' | 'createdAt' | 'updatedAt'> & {
      id?: string;
      createdAt?: Date;
      updatedAt?: Date;
    },
  ): Category {
    return new Category({
      id: props.id ?? crypto.randomUUID(),
      name: props.name,
      description: props.description,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt,
    });
  }

  static restore(data: any): Category {
    return new Category({
      id: data.id,
      name: data.name,
      description: data.description,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
