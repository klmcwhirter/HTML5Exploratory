#!/bin/sh

RES=960x320


convert $1 -resize ${RES}\> \
      -size ${RES} xc:transparent +swap -gravity west  -composite \
      $2-${RES}.png


# if [ ! -f bg_${RES}.png ]
# then
#   convert -size ${RES} xc:transparent PNG32:bg_${RES}.png
# fi

# convert $1 -resize ${RES} -gravity center -extent ${RES} tmp_$1.png
# convert -gravity center -resize ${RES} bg_${RES}.png tmp_$1.png $2-${RES}.png

#[ -f tmp_$1.png ] && rm -f tmp_$1.png


#if [ ! -f bg_960x320.png ]
#then
#  convert -size 960x320 xc:transparent PNG32:bg_960x320.png
#fi

#convert $1 -resize 960x320 -gravity center -extent 960x320 tmp_$1
#convert -gravity center -resize 960x320 bg_960x320.png tmp_$1 $2
