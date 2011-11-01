function(doc) {
    if (doc.type & doc.type == 'route' & doc.route_id)
	emit(doc.route_id, doc);
}