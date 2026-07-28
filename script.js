// ======================================================
// SISTEMA DE AUDITORÍA DE INVENTARIO FOTOGRÁFICO
// Evaluación Final POA
// Autor: Jair Acosta Hernández
// ======================================================


//===========================
// INVENTARIO
//===========================

const inventario = [

    {
        codigo: "P001",
        nombre: "Cámara fotográfica Nikon",
        minimo: 5
    },

    {
        codigo: "P002",
        nombre: "Cámara fotográfica Sony",
        minimo: 5
    },

    {
        codigo: "P003",
        nombre: "Lente 80 mm",
        minimo: 5
    },

    {
        codigo: "P004",
        nombre: "Flash",
        minimo: 3
    },

    {
        codigo: "P005",
        nombre: "Memoria SD",
        minimo: 10
    },

    {
        codigo: "P006",
        nombre: "Disco duro SSD",
        minimo: 6
    },

    {
        codigo: "P007",
        nombre: "Trípode",
        minimo: 5
    }

];



//===========================
// REFERENCIAS
//===========================

const tabla = document.getElementById("inventoryTable");

const reporte = document.getElementById("report");

const contenidoReporte = document.getElementById("reportContent");

const reabastecimiento = document.getElementById("restock");

const contenidoReabastecimiento = document.getElementById("restockContent");

const fechaActual = document.getElementById("fechaActual");

const totalArticulos = document.getElementById("totalArticulos");

const articulosPedido = document.getElementById("articulosPedido");

const porcentaje = document.getElementById("porcentaje");



//===========================
// FECHA AUTOMÁTICA
//===========================

const hoy = new Date();

fechaActual.innerHTML =
    "<strong>Fecha:</strong> " +
    hoy.toLocaleDateString("es-CO") +
    " " +
    hoy.toLocaleTimeString("es-CO");



//===========================
// ESTADÍSTICAS
//===========================

totalArticulos.textContent = inventario.length;

articulosPedido.textContent = "0";

porcentaje.textContent = "100%";



//===========================
// CARGAR TABLA
//===========================

function cargarTabla() {

    tabla.innerHTML = "";

    inventario.forEach((articulo, indice) => {

        tabla.innerHTML += `

        <tr>

            <td>${articulo.codigo}</td>

            <td>${articulo.nombre}</td>

            <td>

                <input
                    type="number"
                    id="stock${indice}"
                    min="0"
                    value="0">

            </td>

        </tr>

        `;

    });

}

cargarTabla();



//===========================
// CALCULAR PEDIDO
//===========================

function calcularPedido(actual, minimo) {

    if (actual < minimo) {

        return minimo - actual;

    }

    return 0;

}



//===========================
// CLASIFICAR INVENTARIO
//===========================

function clasificar(actual, minimo) {

    if (actual <= minimo / 2) {

        return "CRÍTICO";

    }

    if (actual < minimo) {

        return "BAJO";

    }

    return "SUFICIENTE";

}



//===========================
// VALIDAR NÚMERO
//===========================

function validar(valor) {

    if (isNaN(valor)) {

        return false;

    }

    if (valor < 0) {

        return false;

    }

    return true;

}



//===========================
// OBTENER COLOR
//===========================

function obtenerClase(estado) {

    switch (estado) {

        case "CRÍTICO":

            return {

                item: "critical",

                badge: "badge-critical"

            };

        case "BAJO":

            return {

                item: "low",

                badge: "badge-low"

            };

        default:

            return {

                item: "ok",

                badge: "badge-ok"

            };

    }

}
//======================================================
// GENERAR REPORTE
//======================================================

document
.getElementById("generateReport")
.addEventListener("click", () => {

    reporte.classList.remove("hidden");
    reabastecimiento.classList.remove("hidden");

    contenidoReporte.innerHTML = "";
    contenidoReabastecimiento.innerHTML = "";

    let cantidadPedidos = 0;
    let cantidadSuficientes = 0;

    inventario.forEach((articulo, indice) => {

        const actual = parseInt(
            document.getElementById(`stock${indice}`).value
        );

        if (!validar(actual)) {

            alert(
                "Ingrese únicamente números enteros mayores o iguales a cero."
            );

            throw new Error("Dato inválido.");

        }

        const estado = clasificar(
            actual,
            articulo.minimo
        );

        const pedir = calcularPedido(
            actual,
            articulo.minimo
        );

        const clase = obtenerClase(estado);

        if (estado === "SUFICIENTE") {

            cantidadSuficientes++;

        }

        contenidoReporte.innerHTML += `

        <div class="item ${clase.item}">

            <h3>${articulo.nombre}</h3>

            <p><strong>Código:</strong> ${articulo.codigo}</p>

            <p><strong>Existencias:</strong> ${actual}</p>

            <p><strong>Stock mínimo:</strong> ${articulo.minimo}</p>

            <span class="badge ${clase.badge}">
                ${estado}
            </span>

            <p style="margin-top:15px;">

                <strong>Unidades a solicitar:</strong>

                ${pedir}

            </p>

        </div>

        `;

        if (pedir > 0) {

            cantidadPedidos++;

            contenidoReabastecimiento.innerHTML += `

            <div class="item ${clase.item}">

                📦 <strong>${articulo.nombre}</strong>

                <br><br>

                Deben solicitarse

                <strong>${pedir}</strong>

                unidades.

            </div>

            `;

        }

    });



//======================================================
// ESTADÍSTICAS
//======================================================

    articulosPedido.textContent = cantidadPedidos;

    const cumplimiento = Math.round(
        (cantidadSuficientes / inventario.length) * 100
    );

    porcentaje.textContent = cumplimiento + "%";



//======================================================
// SI TODO ESTÁ BIEN
//======================================================

    if (cantidadPedidos === 0) {

        contenidoReabastecimiento.innerHTML = `

        <div class="item ok">

            <h3>

                ✅ Inventario en buen estado

            </h3>

            <p>

                Ningún artículo requiere reabastecimiento.

            </p>

        </div>

        `;

    }



//======================================================
// DESPLAZAMIENTO AUTOMÁTICO
//======================================================

    reporte.scrollIntoView({

        behavior: "smooth"

    });

});



//======================================================
// LIMPIAR
//======================================================

document
.getElementById("clearData")
.addEventListener("click", () => {

    inventario.forEach((articulo, indice) => {

        document.getElementById(
            `stock${indice}`
        ).value = 0;

    });

    reporte.classList.add("hidden");

    reabastecimiento.classList.add("hidden");

    contenidoReporte.innerHTML = "";

    contenidoReabastecimiento.innerHTML = "";

    articulosPedido.textContent = "0";

    porcentaje.textContent = "100%";

});



//======================================================
// IMPRIMIR
//======================================================

document
.getElementById("printReport")
.addEventListener("click", () => {

    if (reporte.classList.contains("hidden")) {

        alert("Primero genere el reporte.");

        return;

    }

    window.print();

});
