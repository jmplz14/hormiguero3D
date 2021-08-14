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

https://user-images.githubusercontent.com/26877681/129450883-952f04a3-c2f8-453a-8503-308b8cb034bd.mp4

En la parte inferior de la pantalla principal tendremos dos botones. El primero tiene la funcionalidad de volver los valores iniciales de la cámara para colocarla en la posición inicial de nuevo

https://user-images.githubusercontent.com/26877681/129450903-02c5bf7e-5c84-4262-9ddf-77a14e2e51c3.mp4

El otro botón nos da la opción de descargarnos un fichero zip con todos los ficheros stl de las piezas que estamos viendo. 

https://user-images.githubusercontent.com/26877681/129450921-b83e01ba-cf2c-4048-9a8b-ca45a65e35a9.mp4

También mostramos la información de las piezas por las que pasamos el ratón en la esquina superior izquierda de la pantalla. Se mostrara el nombre del fichero que le corresponde y las medidas de dichas piezas.

https://user-images.githubusercontent.com/26877681/129450936-9dfb470b-6b86-42cb-b950-1c46d4a4b36e.mp4

Con esto tenemos explicada toda la función del menu inicial de la aplicación. Nos queda la parte que nos muestra las piezas de una forma más detallada y individual. Para esto solo tenemos que hacer doble click en una de las piezas y nos llevara a la vista individual. En la esquina superior izquierda se mostrara la información de la pieza que estamos observando. En el mismo video vemos como pulsando el boton de home volveriamos a la vista de todas las piezas juntas.

https://user-images.githubusercontent.com/26877681/129450941-a04a2778-df7c-4cd9-80d4-425ddc0e73df.mp4

Vemos como se ha aumentado la botonera y tenemos más opciones. 
Lo primero que podemos hacer es pasar de una pieza a otra con los botones de los dos extremos de la botonera.

https://user-images.githubusercontent.com/26877681/129450951-04a904f7-282f-4e9c-9eab-9c68dcdbbc1f.mp4

Ademas podemos mover la cámara como en la pantalla de inicio y volver la cámara a la posición inicial posteriormente. 


https://user-images.githubusercontent.com/26877681/129450963-fb63c196-114e-422b-a381-cd74b2fd9f63.mp4



Tenemos la opción de escalar una pieza y volver a dejarla como estaba anteriormente volviendo a pulsar el botón de escalado. 

https://user-images.githubusercontent.com/26877681/129450978-e4fa97bd-236f-4f98-8acc-1cd32b055783.mp4

Podemos descargar el fichero de la pieza que estamos visualizando. 

https://user-images.githubusercontent.com/26877681/129450985-00b14571-9ec4-4d7c-a815-ae30fcac3289.mp4

Por ultimo tenemos un menu lateral con todas las piezas dividas por secciones. Este menu nos da la opción de buscar una pieza que queremos visualizar de una forma más rápida que pasando de una a otra. Podremos desplegar varias secciones o ninguna según las que nos interese ver y al hacer doble click sobre una pieza sera visualizada esta en la pantalla. 

https://user-images.githubusercontent.com/26877681/129450998-650a4505-700f-4445-9796-8240488aeee0.mp4
