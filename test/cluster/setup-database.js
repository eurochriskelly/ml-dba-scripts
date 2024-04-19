javascript=
const DATA = [
  {
    database: 'testdb_A',
    forests: ['fA1', 'fA2']
  },
  {
    database: 'testdb_B',
    forests: ['fB1', 'fB2']
  }
]

const { database, forest, hosts } = xdmp
const {
  getConfiguration,
  saveConfiguration,
  forestCreate,
  databaseAttachForest,
  databaseExists,
  forestExists,
  databaseCreate,
} = require("/MarkLogic/admin.xqy")

DATA.forEach((datum) => {
  let C = getConfiguration()
  let newConf
  if (!databaseExists(C, datum.database)) {
    newConf = databaseCreate(C, datum.database, database('Security'), database('Schemas'))
    saveConfiguration(newConf)  
  }

  const hlist = Array.from(hosts())
  datum.forests.forEach((f, i) => {
    const h = hlist[i % hlist.length]
    const fName = datum.forests[i]
    if (!forestExists(C, fName)) {
      saveConfiguration(forestCreate(C, fName, h, null, null, null))  
    }
  })

  datum.forests.forEach((f, i) => {
    const fName = datum.forests[i]
    if (forestExists(C, fName)) {
      saveConfiguration(databaseAttachForest(C, database(datum.database), forest(fName)))  
    }
  })
})
"Database setup complete"


