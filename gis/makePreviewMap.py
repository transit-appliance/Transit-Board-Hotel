#!/usr/bin/python

# makePreviewMap.py: render a preview map of the given xml and output

# Copyright 2011 Portland Transport

# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at

#   http://www.apache.org/licenses/LICENSE-2.0

# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

try:
    import mapnik2 as mapnik
except:
    import mapnik

import sys

mapfile = sys.argv[1]
map_output = sys.argv[2]
m = mapnik.Map(1000, 1000)
mapnik.load_map(m, mapfile)

# TODO: hardwired to Portland
bbox = mapnik.Envelope(mapnik.Coord(-13692838,5686969), 
                       mapnik.Coord(-13625904,5718540))
m.zoom_to_box(bbox) 
mapnik.render_to_file(m, map_output)
