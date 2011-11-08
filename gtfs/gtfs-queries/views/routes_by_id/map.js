// must use reduce=false

function(doc) {
    if (doc.type && doc.type == 'routes' && doc.route_id)
       emit(doc.route_id, doc);
}