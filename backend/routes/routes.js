import { MongoClient } from "mongodb"
import dotenv from "dotenv"
import express from "express"

dotenv.config()
const routes = express.Router()
const dbname = "CampusLands_EPS"
const uri = process.env.MONGO_URI101


//1. Obtener todos los pacientes de manera alfabética.
routes.get("/punto1", async (req, res) => {
    try {
        const cliente = new MongoClient(uri)
        cliente.connect()
        const response = await cliente.db(dbname).collection("usuario").find().sort({ usu_nombre: 1 }).toArray()
        res.json(response)
        cliente.close()
    } catch (error) {
        res.status(404).json(error)
    }
})



//2. Obtener las citas de una fecha en específico , donde se ordene los pacientes de manera alfabética.
routes.get("/punto2", async (req, res) => {
    try {
        const cliente = new MongoClient(uri)
        cliente.connect()

        //ejemplo peticion de una fecha en especifico
        const parametros = {
            "cit_fecha": "1/1/2023"
        }

        const response = await cliente.db(dbname).collection("cita").find(parametros).sort({ cit_datosUsuario: 1 }).toArray()

        res.json(response)
        cliente.close()
    } catch (error) {
        res.status(404).json(error)
    }
})



//3. Obtener todos los médicos de una especialidad en específico (por ejemplo, ‘Cardiología’).
routes.get("/punto3", async (req, res) => {
    try {
        const cliente = new MongoClient(uri)
        cliente.connect()

        const parametro = {
            "med_especialidad": "Quirúrgica"
        }


        const response = await cliente.db(dbname).collection("medico").find(parametro).toArray()
        res.json(response)
        cliente.close()
    } catch (error) {
        res.status(404).json(error)
    }
})


//4. Encontrar la próxima cita para un paciente en específico (por ejemplo, el paciente con user_id 1).
routes.get("/punto4", async (req, res) => {
    try {
        const cliente = new MongoClient(uri)
        cliente.connect()


        //usuario ejemplo
        const response1 = await cliente.db(dbname).collection("usuario").findOne({ usu_nombre: { $eq: "Amed_nombre1" } })

        //sacamos los cit_datosusuario en 
        const response2 = await cliente.db(dbname).collection("cita").distinct("cit_datosUsuario")

        //detectar si tiene o no citas
        const x = response2.filter(fill => fill.includes(response1.usu_nombre))
        if (x.length == 0) {
            res.json("no hay citas")
        }

        //buscar las citas del usuario
        const y = await cliente.db(dbname).collection("cita").findOne({ cit_datosUsuario: { $eq: (String(x)) } })

        res.json({ x, y })

        cliente.close()
    } catch (error) {
        console.log(error);
        res.status(404).json(error)
    }
})


//5. Encontrar todos los pacientes que tienen citas con un médico en específico (por ejemplo, el médico con med_numMatriculaProfesional 1).
routes.get("/punto5", async (req, res) => {
    try {
        const cliente = new MongoClient(uri)
        cliente.connect()

        //ejemplo peticion una cita en especifico
        const parametro = {
            "cit_medico": "Medico 6"
        }

        const response = await cliente.db(dbname).collection("cita").find(parametro).toArray()
        res.json(response)
        cliente.close()
    } catch (error) {
        res.status(404).json(error)
    }
})




//6. Encontrar todas las citas de un día en específico (por ejemplo, ‘2023-07-12’).
routes.get("/punto6", async (req, res) => {
    try {
        const cliente = new MongoClient(uri)
        cliente.connect()

        //ejemplo peticion un dia en especifico
        const parametro = {
            "cit_fecha": "3/3/2023"
        }

        const response = await cliente.db(dbname).collection("cita").find(parametro).toArray()
        res.json(response)
        cliente.close()
    } catch (error) {
        res.status(404).json(error)
    }
})


//7. Obtener todos los médicos con sus consultorios correspondientes.
routes.get("/punto7", async (req, res) => {
    try {
        const cliente = new MongoClient(uri)
        cliente.connect()

        const response = await cliente.db(dbname).collection("medico").find().toArray()

        res.json(response)
        cliente.close()
    } catch (error) {
        res.status(404).json(error)
    }
})

//intento de punto7
/* routes.get("/punto7", async (req, res) => {
    try {
        const cliente = new MongoClient(uri)
        cliente.connect()

        const response = await cliente.db(dbname).collection("medico").find().toArray()
        const response2 = await cliente.db(dbname).collection("consultorio").distinct("_id")

        const saveMedicos = []

        response.forEach(async element => {
            const x = element;

            const a = response2.filter(fill => fill.includes(element.med_consultorio))
            console.log(a);

        });
        res.json(response2)
        cliente.close()
    } catch (error) {
        res.status(404).json(error)
    }
}) */


//8. Contar el número de citas que un médico tiene en un día específico (por ejemplo, el médico con med_numMatriculaProfesional 1 en ‘2023-07-12’).
routes.get("/punto8", async (req, res) => {
    try {
        const cliente = new MongoClient(uri)
        cliente.connect()

        const response = await cliente.db(dbname).collection("cita").find({ cit_medico: { $eq: "Medico 1" } }).toArray()
        const totalCitas = response.length
        res.json({ totalCitas, response })
        cliente.close()
    } catch (error) {
        res.status(404).json(error)
    }
})



//9. Obtener lo/s consultorio/s donde se aplicó las citas de un paciente.
routes.get("/punto9", async (req, res) => {
    try {
        const cliente = new MongoClient(uri)
        cliente.connect()
        const response = await cliente.db(dbname).collection("consultorio").find().toArray()
        res.json(response)
        cliente.close()
    } catch (error) {
        console.log(error);
        res.status(404).json(error)
    }
})


//10. Obtener todas las citas realizadas por los pacientes de acuerdo al género registrado, siempre y cuando el estado de la cita se encuentra registrada como “Atendida”.
routes.get("/punto10", async (req, res) => {
    try {
        const cliente = new MongoClient(uri)
        cliente.connect()

        const response = await cliente.db(dbname).collection("cita").find({ cit_estado: { $eq: "Atendida" } }).toArray()
        res.json(response)

        cliente.close()
    } catch (error) {
        console.log(error);
        res.status(404).json(error)
    }
})


//11. Insertar un paciente a la tabla usuario, donde si es menor de edad deberá solicitar primero que ingrese el acudiente y validar si ya estaba registrado el acudiente (El usuario deberá poder ingresar de manera personalizada los datos del usuario a ingresar).








export default routes