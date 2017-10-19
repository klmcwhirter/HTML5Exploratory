#!/bin/sh

RES=2600x2600

convert $1 -resize ${RES}\> \
      -size ${RES} xc:transparent +swap -gravity center  -composite \
      $2-${RES}.png

# if [ ! -f bg_${RES}.png ]
# then
#   convert -size ${RES} xc:transparent PNG32:bg_${RES}.png
# fi

# convert $1 -resize ${RES} -gravity center -extent ${RES} tmp_$1.png
# convert -gravity center -resize ${RES} bg_${RES}.png tmp_$1.png $2-${RES}.jpg

#[ -f tmp_$1.png ] && rm -f tmp_$1.png
