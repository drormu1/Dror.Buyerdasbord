//oncontenxt remember :   selectedAggregation, current oage
module.exports = class SearchRequest {
    
    constructor(){}
    
    static indices = [];
    static activeIndex=0;
    static term = '*';
    static page = 0;
    static pageSize=100;
    static selectedAggregations= [];
    static specialAggregations = [];    
    static andCondition='or';
    static sort='';
    static sortDirection='desc';

};


