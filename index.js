const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const puerto = 8080;


const productos = [{
    title: 'Escuadra',
    price: 123.45,
    thumbnail: 'https://cdn3.iconfider.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png',
    id: uuidv4()
},
{
    title: 'Calculadora',
    price: 234.56,
    thumbnail: 'http://cdn3.iconfider.com/data/icons/education-209/64/calculator-math-tool-school-256.png',
    id: uuidv4()
},
{
    title: 'Globo Terráqueo',
    price: 345.67,
    thumbnail: 'http://cdn3.iconfider.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png',
    id: uuidv4()
}]

const servidor = http.createServer((pet, resp) => {
    resp.end('Hola Mundo');
});

const srv = app.listen(puerto, () => {
    console.log('Server listo, escuchando en el puerto', puerto)
});

app.get('/', (req, res) => {
    res.json({
        mensaje: 'HOLA DESDE LA RUTA PRINCIPAL'
    })
})

app.get('/productos', (req, res) => {
    const myfilePath = path.resolve(__dirname, './productos.txt')
    res.sendFile(myfilePath)
})

app.get('/productosRandom', (req, res) => {
    const random = productos[Math.floor(Math.random() * productos.length)];
    res.json(random)
})

app.get('/productos/:id', (req, res) => {
    const idProd = req.params.id;
    const producto = productos.find((aProduct) => aProduct.id == idProd);

    if (!producto)
        return res.status(404).json({
            msg: 'Producto not found',
        });

    res.json({
        data: producto,
    });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post('/productos', (req, res) => {
    const body = req.body;
    console.log(body)

    if (
        !body.title ||
        !body.price ||
        typeof body.title != 'string' ||
        typeof body.price != 'number'
    ) {
        return res.status(400).json({
            msg: 'Necesito en el body un nombre que sea (string) y el precio un (number)'
        });
    }

    const nuevoProducto = {
        title: body.title,
        price: body.price,
        id: uuidv4(),
    };

    productos.push(nuevoProducto);

    res.status(201).json({
        data: nuevoProducto,
    });
});

app.put('/productos/:id', (req, res) => {
    console.log(req.params);
    const idProd = (req.params.id);
    const body = req.body;

    const posicion = productos.findIndex((aProduct) => aProduct.id == idProd);

    if (posicion == -1) {
        return res.status(404).json({
            msg: 'Product not found',
        });
    }

    if (
        !body.title ||
        !body.price ||
        typeof body.title != 'string' ||
        typeof body.price != 'number'
    ) {
        return res.status(400).json({
            msg: 'Necesito en el body el nombre (string) y el precio (number)',
        });
    }

    productos[posicion].title = body.title;
    productos[posicion].price = body.price;

    res.status(201).json({
        data: productos[posicion],
    });
});


app.delete('/productos/:id', (req, res) => {
    console.log(req.params);
    const idBuscado = Number(req.params.id);

    const posicion = productos.findIndex((aProduct) => aProduct.id === idBuscado);
    if (posicion == -1) {
        return res.status(404).json({
            msg: 'Product not found',
        });
    }

    productos.splice(posicion, 1);

    res.json({
        data: productos,
    });
});

app.get('/productos/find', (req, res) => {
    console.log(req.query);

    res.json({
        data: productos,
    });
});

const mainRouter = require('./routes/index')

app.use('/api', mainRouter);