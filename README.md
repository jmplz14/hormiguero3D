# Hormiguero 3D
## Descripción
He realizado una pequeña aplicación para mostrar todas las piezas de un proyecto 3d de la web [thingivese](https://www.thingiverse.com/). El proyecto se llama [formicarium BetterForm](https://www.thingiverse.com/thing:2750544) y se trata de un hormiguero modular con muchas piezas distinta.

Con esta aplicación solo busco tener una forma de ver mejor las piezas y poder elegir cual imprimir de una forma más sencilla y más intuitiva. De otra manera tendría que tener varios archivos stl abiertos a la vez y no tendría una visión rápida de todas las piezas. 

## Herramientas Utilizadas. 
 [Three.js](https://threejs.org/): Esta librería se encargara de cargar todos los ficheros stl y visualizar todas las partes 3d del proyecto. También nos dará las opciones para poder interactuar con ellos. 
[Django]: En la parte del servido utilizaremos django al estar familiarizado ya con su uso.
[Postgress]: En este caso la base de datos solo almacenara los datos de las piezas (Nombre fichero, tamaño y imagen).
[Docker]: Sera el encargado de desplegar los contenedores para la web y la base de datos.
Después para realizar la aplicación web se utilizara como es lógico css, html y javascript. 

## Funcionalidad de la aplicación
Al iniciar la aplicación nos mostrara todas las piezas del proyecto alineadas y colocadas por filas. De esta forma tendremos una vista rápida de todas para poder seleccionar las que queramos ver.
Podremos acercar y alejar la cámara ademas de rotar para ver las piezas desde otra perspectiva.
### Video 1

En la parte inferior de la pantalla principal tendremos dos botones. El primero tiene la funcionalidad de volver los valores iniciales de la cámara para colocarla en la posición inicial de nuevo

### Video 2

El otro botón nos da la opción de descargarnos un fichero zip con todos los ficheros stl de las piezas que estamos viendo. 

### video 3

También mostramos la información de las piezas por las que pasamos el ratón en la esquina superior izquierda de la pantalla. Se mostrara el nombre del fichero que le corresponde y las medidas de dichas piezas.
### video 5

Con esto tenemos explicada toda la función del menu inicial de la aplicación. Nos queda la parte que nos muestra las piezas de una forma mas detallada y individual. Para esto solo tenemos que hacer doble click en una de las piezas y nos llevara a la vista individual. En la esquina superior izquierda se mostrara la información de la pieza que estamos observando. 

### Video4
También vemos como se ha aumentado la botonera y tenemos mas opciones. 
Lo primero que podemos hacer es pasar de una pieza a otra con los botones de los dos extremos de la botonera.

### Video 6

Ademas también podemos mover la cámara como en la pantalla de inicio y volver la cámara a la posición inicial posteriormente. 
### Video7

También tenemos la opción de escalar una pieza y volver a dejarla como estaba anteriormente volviendo a pulsar el botón de escalado. 

### Video 8
Tambien tenemos la opcion de descargar el fichero de la pieza que estamos visualizando. 
### Video 9
Por ultimo tenemos un menu lateral con todas las piezas dividas por secciones. Este menu nos da la opción de buscar una pieza que queremos visualizar de una forma mas rápida que pasando de una a otra. Podremos desplegar varias secciones o ninguna según las que nos interese ver y al hacer doble click sobre una pieza sera visualizada esta en la pantalla. 
### Video 10