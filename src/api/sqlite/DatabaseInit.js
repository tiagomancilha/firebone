import { DatabaseConnection } from './SQLiteDatabase'

var db = null
export default class DatabaseInit {

    constructor() {
        db = DatabaseConnection.getConnection()
        this.InitDb()
    }

    InitDb = ()=> {
        db.transaction((tx) => {
            console.log('criou a tabela Marcadores')         
           // tx.executeSql("DROP TABLE pedidos;");     
            tx.executeSql(
              "CREATE TABLE IF NOT EXISTS marcadores (id INTEGER PRIMARY KEY AUTOINCREMENT, tipo TEXT, titulo TEXT, descricao TEXT, latitude REAL, longitude REAL, atualizado INTEGER(1));"
            );
          }, (error) => {
            console.log("error call back : " + JSON.stringify(error));
            console.log(error);
        }, () => {
            console.log("transaction complete call back ");
        });     
    }

}