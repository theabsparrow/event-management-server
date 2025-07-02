import { Query } from "mongoose";

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;
  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const searchTerm = this.query.searchTerm;
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map((field) => ({
          [field]: { $regex: searchTerm, $options: "i" },
        })),
      });
    }
    return this;
  }

  filter() {
    const queryObject = { ...this.query };
    const excludeFields = [
      "searchTerm",
      "sort",
      "sortOrder",
      "limit",
      "page",
      "fields",
      "startDate",
      "endDate",
    ];
    excludeFields.forEach((element) => delete queryObject[element]);
    if (this.query.startDate && this.query.endDate) {
      const startDate = new Date(this.query.startDate as string);
      const endDate = new Date(this.query.endDate as string);
      queryObject.date = { $gte: startDate, $lte: endDate };
    }
    this.modelQuery = this.modelQuery.find(queryObject);
    return this;
  }

  sort() {
    const sortBy = this.query.sort as string | undefined;
    const sortOrder = this.query.sortOrder === "asc" ? 1 : -1;

    if (sortBy) {
      const fields = sortBy.split(",").map((field) => {
        return { [field]: sortOrder };
      });
      this.modelQuery = this.modelQuery.sort(Object.assign({}, ...fields));
    } else {
      this.modelQuery = this.modelQuery.sort({ date: -1, time: -1 });
    }

    return this;
  }
  paginateQuery() {
    const limit = Number(this?.query?.limit) || 0;
    const page = Number(this?.query?.page) || 1;
    const skip = (page - 1) * limit || 0;
    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  fields() {
    const compulsoryFields = "";
    const fields = this?.query?.fields
      ? (this?.query?.fields as string).split(",").join(" ")
      : compulsoryFields;
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  async countTotal() {
    const totalQueries = this.modelQuery.getFilter();
    const total = await this.modelQuery.model.countDocuments(totalQueries);
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 20;
    const totalPage = Math.ceil(total / limit);
    return {
      page,
      limit,
      total,
      totalPage,
    };
  }
}

export default QueryBuilder;
