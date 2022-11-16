const router = require("express").Router();
const connection = require('../dbConfig')

const heroCtrl = {

    get_hero_data : async (req, res) =>{
        connection.query('select wallet_address from hero_data',(error, rows) => {
            if(error) throw error;
        })
    },
    //연결중
    insert_WalletAddress : async (req, res) => {
        const id = req.body.myAddress;
        const sql = `insert into hero_data(wallet_address) values(?);`
        
        connection.query(
            sql,[id], (error, rows) => {
                if(error) throw error;
                console.log(rows)
            }
        )
    }

}

router.route('/')
    .get(heroCtrl.get_hero_data)
    .post(heroCtrl.insert_WalletAddress)

module.exports = router;