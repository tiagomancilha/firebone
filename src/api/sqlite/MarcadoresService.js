import { DatabaseConnection } from './SQLiteDatabase'

const db=DatabaseConnection.getConnection()

export default class MarcadoresService{

    static create = (obj) => {
        return new Promise((resolve, reject) => {
          db.transaction((tx) => {
            //comando SQL modificável
            tx.executeSql(
              "INSERT INTO marcadores (tipo, titulo, descricao, latitude, longitude, concluido) values ( ?, ?, ?, ?, ?, ?);",
              [obj.tipo, obj.titulo, obj.descricao, obj.latitude, obj.longitude, 0],
              //-----------------------
              (_, { rowsAffected, insertId }) => {
                if (rowsAffected > 0) resolve(insertId);
                else reject("Error inserting obj: " + JSON.stringify(obj)); // insert falhou
              },
              (_, error) => reject(error) // erro interno em tx.executeSql
            );
          });
        });
    };
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    static update = (id, obj) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    "UPDATE pedidos SET nome=?, valor=?, datahora=?, latitude=?, longitude=?, obs=?, concluido=? WHERE id=?;",
                    [obj.nome, obj.valor, obj.datahora, obj.latitude, obj.longitude, obj.obs, obj.concluido, id],
                    (_, { rowsAffected }) => {
                        if (rowsAffected > 0) resolve(rowsAffected);
                        else reject("Error updating obj: id=" + id); // nenhum registro alterado
                    },
                    (_, error) => reject(error) // erro interno em tx.executeSql
                );
            });
        });
    };
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
    static find = (id) => {
        return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            //comando SQL modificável
            tx.executeSql(
            "SELECT * FROM pedidos WHERE id=?;",
            [id],
            //-----------------------
            (_, { rows }) => {
                if (rows.length > 0) resolve(rows._array[0]);
                else reject("Obj not found: id=" + id); // nenhum registro encontrado
            },
            (_, error) => reject(error) // erro interno em tx.executeSql
            );
        });
        });
    };
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
static findByStatus = (concluido) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        //comando SQL modificável
        tx.executeSql(
          "SELECT * FROM pedidos WHERE concluido LIKE ?;",
          [concluido],
          //-----------------------
          (_, { rows }) => {
            if (rows.length > 0) resolve(rows._array);
            else reject("Obj not found: status=" + concluido); // nenhum registro encontrado
          },
          (_, error) => reject(error) // erro interno em tx.executeSql
        );
      });
    });
  };
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
static findByDate = (data) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        //comando SQL modificável
        tx.executeSql(
          "SELECT * FROM pedidos WHERE datahora LIKE ?;",
          [concluido],
          //-----------------------
          (_, { rows }) => {
            if (rows.length > 0) resolve(rows._array);
            else reject("Obj not found: status=" + data); // nenhum registro encontrado
          },
          (_, error) => reject(error) // erro interno em tx.executeSql
        );
      });
    });
  };
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
static all = () => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        //comando SQL modificável
        tx.executeSql(
          "SELECT * FROM pedidos;",
          [],
          //-----------------------
          (_, { rows }) => resolve(rows._array),
          (_, error) => reject(error) // erro interno em tx.executeSql
        );
      });
    });
  };
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    static remove = (id) => {
        return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            //comando SQL modificável
            tx.executeSql(
            "DELETE FROM pedidos WHERE id=?;",
            [id],
            //-----------------------
            (_, { rowsAffected }) => {
                resolve(rowsAffected);
            },
            (_, error) => reject(error) // erro interno em tx.executeSql
            );
        });
        });
    };
}