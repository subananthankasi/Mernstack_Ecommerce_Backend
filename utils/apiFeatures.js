class apiFeature {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }
    search() {
        let keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i"
            }
        } : {}
        this.query.find({ ...keyword })
        return this;
    }

    // filter() {
    //     const queryStrCopy = { ...this.queryStr }
    //     const removeFeilds = ['keyword', 'limit', 'page'];
    //     removeFeilds.forEach(field => delete queryStrCopy[field]);
    //     let queryStr = JSON.stringify(queryStrCopy)
    //     queryStr = queryStr.replace(/\b(gt|gte|lt|lte)/g, match => `$${match}`)
    //     console.log("queryStr",queryStr)
    //     this.query = this.query.find(JSON.parse(queryStr))
    //     console.log("price",this)
    //     return this;
    // };
   filter() {
    const queryObj = { ...this.queryStr }
    const removeFields = ['keyword', 'limit', 'page']
    removeFields.forEach(field => delete queryObj[field])
    const mongoFilter = {}
    Object.keys(queryObj).forEach(key => {
        if (key.includes('[')) {
            const [field, operator] = key.replace(']', '').split('[')
            if (!mongoFilter[field]) {
                mongoFilter[field] = {}
            }
            mongoFilter[field][`$${operator}`] = Number(queryObj[key])
        } else {
            mongoFilter[key] = queryObj[key]
        }
    })

    this.query = this.query.find(mongoFilter)
    return this
}


    paginate(resPerPage) {
        const currentPage = Number(this.queryStr.page) || 1
        const skip = resPerPage * (currentPage - 1)
        this.query.limit(resPerPage).skip(skip)

        return this
    };
}
module.exports = apiFeature