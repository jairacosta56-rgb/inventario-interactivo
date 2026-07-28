// ==========================================
// SISTEMA DE AUDITORÍA DE INVENTARIO
// Evaluación Final POA
// Jair Acosta Hernández
// ==========================================

// Inventario
const inventario = [
    { codigo: "P001", nombre: "Cámara fotográfica Nikon", minimo: 5 },
    { codigo: "P002", nombre: "Cámara fotográfica Sony", minimo: 5 },
    { codigo: "P003", nombre: "Lente 80 mm", minimo: 5 },
    { codigo: "P004", nombre: "Flash", minimo: 3 },
    { codigo: "P005", nombre: "Memoria SD", minimo: 10 },
    { codigo: "P006", nombre: "Disco duro SSD", minimo: 6 },
    { codigo: "P007", nombre: "Trípode", minimo: 5 }
];

// Referencias
const table = document.getElementById("inventoryTable");
const report = document.getElementById("report");
const reportContent = document.getElementById("reportContent");
const restock = document.getElementById("restock");
const restockContent = document.getElementById("restockContent");


// ============================
// CARGAR TABLA
// ============================

function cargarTabla(){

    table.innerHTML = "";

    inventario.forEach((articulo,index)=>{

        table.innerHTML += `

        <tr>

            <td>${articulo.codigo}</td>

            <td>${articulo.nombre}</td>

            <td>

                <input
                    type="number"
                    min="0"
                    id="stock${index}"
                    value="0">

            </td>

        </tr>

        `;

    });

}

cargarTabla();


// ============================
// CALCULAR PEDIDO
// ============================

function calcularPedido(actual,minimo){

    if(actual < minimo){

        return minimo - actual;

    }

    return 0;

}


// ============================
// CLASIFICAR
// ============================

function clasificar(actual,minimo){

    if(actual <= minimo/2){

        return "CRÍTICO";

    }

    if(actual < minimo){

        return "BAJO";

    }

    return "SUFICIENTE";

}


// ============================
// GENERAR REPORTE
// ============================

document
.getElementById("generateReport")
.addEventListener("click",()=>{

    report.classList.remove("hidden");
    restock.classList.remove("hidden");

    reportContent.innerHTML="";
    restockContent.innerHTML="";

    let hayPedidos=false;

    inventario.forEach((articulo,index)=>{

        const actual=parseInt(
            document.getElementById(`stock${index}`).value
        );

        if(isNaN(actual) || actual<0){

            alert(
                "Ingrese solamente cantidades válidas."
            );

            return;

        }

        const estado=clasificar(
            actual,
            articulo.minimo
        );

        const pedir=calcularPedido(
            actual,
            articulo.minimo
        );

        let clase="";
        let badge="";

        if(estado==="CRÍTICO"){

            clase="critical";
            badge="badge-critical";

        }

        else if(estado==="BAJO"){

            clase="low";
            badge="badge-low";

        }

        else{

            clase="ok";
            badge="badge-ok";

        }

        reportContent.innerHTML += `

        <div class="item ${clase}">

            <h3>

                ${articulo.nombre}

            </h3>

            <p>

                Código:
                <strong>${articulo.codigo}</strong>

            </p>

            <p>

                Stock disponible:
                <strong>${actual}</strong>

            </p>

            <p>

                Stock mínimo:
                <strong>${articulo.minimo}</strong>

            </p>

            <span class="badge ${badge}">

                ${estado}

            </span>

            <p style="margin-top:15px;">

                Cantidad a solicitar:

                <strong>

                    ${pedir}

                </strong>

            </p>

        </div>

        `;

        if(pedir>0){

            hayPedidos=true;

            restockContent.innerHTML += `

            <div class="item">

                📦
                <strong>

                    ${articulo.nombre}

                </strong>

                <br><br>

                Solicitar

                <strong>

                    ${pedir}

                </strong>

                unidades.

            </div>

            `;

        }

    });

    if(!hayPedidos){

        restockContent.innerHTML=`

        <div class="item ok">

            ✅ Todos los artículos tienen existencias suficientes.

        </div>

        `;

    }

    report.scrollIntoView({

        behavior:"smooth"

    });

});


// ============================
// LIMPIAR
// ============================

document
.getElementById("clearData")
.addEventListener("click",()=>{

    inventario.forEach((articulo,index)=>{

        document.getElementById(
            `stock${index}`
        ).value=0;

    });

    report.classList.add("hidden");
    restock.classList.add("hidden");

});
