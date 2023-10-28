/**
 * Run with:
 *
 * ```sh
 * npx ts-node --esm .\immudb-node-showcase\src\sql-showcase.ts
 * ```
 */
import { Client, verifyVerification, types, stream} from '@codenotary/immudb-node'

sqlSchowcase()
  .catch(console.error)

async function sqlSchowcase () {
  const client = new Client({
    host: '127.0.0.1',
    port: 3322,
    user: 'immudb',
    password: 'immudb',
    database: 'defaultdb'
  })

  // since tx used for verification reference
  // cannot be first db transaction lets insert some dummy value:
  const {valEntries: [dummyValEntry]} = await client.setValEntries({kvms: [
    {key: Buffer.of(0), val: Buffer.of(0)}
  ]})

  // state will be dummyValEntry if database was empty
  const stateId2 = await client.getDbCurrentState()
  console.log('stateId2:', stateId2)

  const {subTxes: [{tx: createReadingsTableTx}]} = await client.sqlExec({sql: `
        create table if not exists readings (
            user_id     integer not null,
            reading     integer not null,
            created     timestamp not null,
            data        varchar[512] null,
            primary key (created, user_id)
        );
    `})
  console.log('createReadingsTableTx:', createReadingsTableTx)

  const {subTxes: [{
    tx: insertTestTableTx,
    lastPK: insertTestTableLastPK,
    firstPK: insertTestTableFirstPK,
    updatedRowsCount: insertTestTableUpdatedRowsCount
  }]} = await client.sqlExec({sql: `
        upsert into readings
            (user_id, reading, created, data)
        values
            (1, 400, NOW(), 'USER 1 READING'),
            (2, 10, NOW(), 'USER 2 READING');
            (3, 10, NOW(), 'USER 3 READING');
    `})
  console.log('insertTestTableTx:', insertTestTableTx)
  console.log('insertTestTableLastPK:', insertTestTableLastPK)
  console.log('insertTestTableFirstPK:', insertTestTableFirstPK)
  console.log('insertTestTableUpdatedRowsCount:', insertTestTableUpdatedRowsCount)

  // state at last sql insert (assuming empty db)
  const stateId4 = await client.getDbCurrentState()
  console.log('stateId4:', stateId4)

  const {valEntries: [dummyValEntry1]} = await client.setValEntries({kvms: [
    {key: Buffer.of(0), val: Buffer.of(1)}
  ]})

  // state 1 transactions after last sql insert (assuming empty db)
  const stateId5 = await client.getDbCurrentState()
  console.log('stateId5:', stateId5)

  const {valEntries: [dummyValEntry2]} = await client.setValEntries({kvms: [
    {key: Buffer.of(0), val: Buffer.of(2)}
  ]})

  // state 2 transactions after last sql insert (assuming empty db)
  const stateId6 = await client.getDbCurrentState()
  console.log('stateId6:', stateId6)

  if (createReadingsTableTx) {
    const createTestTableTxVer = await client.getTxAndVerification({
      txId: createReadingsTableTx.id,
      refHash: stateId5.txHash,
      refTxId: stateId5.txId
    })
    verifyVerification(createTestTableTxVer.verification)
    console.log('createTestTableTxVer has been verified.')
  }

  if (insertTestTableTx) {
    const insertTestTableTxVer = await client.getTxAndVerification({
      txId: insertTestTableTx.id,
      refHash: stateId5.txHash,
      refTxId: stateId5.txId
    })
    verifyVerification(insertTestTableTxVer.verification)
    console.log('insertTestTableTxVer has been verified.')
    // console.log('insertTestTableTxVer')
    // console.log(insertTestTableTxVer, {depth: 10})

    // await client.getSqlRowEntryAndVerification({
    //     pk: is.encodeAsPK([
    //         {type: 'INTEGER', isNotNullable: true, val: -2},
    //         {type: 'VARCHAR', isNotNullable: false, val: 'kkk'},
    //     ])
    // })
  }

  console.log('dbScan:', await client.scanDbEntries())

  await client.close()
}
