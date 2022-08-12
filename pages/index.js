import Head from 'next/head'
import styles from '../styles/Home.module.css'
// import { useRouter } from 'next/router'
import { useQuery, gql } from "@apollo/client";

import { Input, Table, Typography, Tag, Tooltip, Radio } from 'antd';
const { Search } = Input;
const { Text } = Typography;
// import { Network, Alchemy } from "alchemy-sdk";
// import { gql } from "@apollo/client";
import client from "../apollo-client";
import { useState } from 'react'

const QUERY1 = gql`
  query  {
    users(skip:1, first:1000,orderBy :currentProfits,orderDirection:asc) {
      id
      totalActions
      totalGas
      totalIncome
      totalExpense
      currentProfits
      hold
    }
  }
`;

const QUERY2 = gql`
  query  {
    users(skip:1, first:1000,orderBy :currentProfits,orderDirection:desc) {
      id
      totalActions
      totalGas
      totalIncome
      totalExpense
      currentProfits
      hold
    }
  }
`;

const columns = [
  {
    title: '地址',
    dataIndex: 'id',
    key: 'id',
    align: 'right',
    width: 200,
    render: (text, item) => <a href={`https://score.web3hooks.com/${text}`} target="_blank" rel="noopener noreferrer">{text}</a>,
  },
  {
    title: '当前持有',
    dataIndex: 'hold',
    key: 'hold',
    align: 'right',
    width:80

  },
  {
    title: '操作次数',
    dataIndex: 'totalActions',
    key: 'totalActions',
    align: 'right',
    width:80
  },
  {
    title: '支出(E)',
    dataIndex: 'totalExpense',
    key: 'totalExpense',
    align: 'right',
    // width: 60,

    render: (v, item) => {
      return (v / 10 ** 18).toFixed(5)
    }

  },

  {
    title: <div>税前收入(E)</div>,
    dataIndex: 'totalIncome',
    key: 'totalIncome',
    align: 'right',
    // width: 80,
    render: (v, item) => {
      return (v / 10 ** 18).toFixed(5) 
    }
  },
  {
    title: <div>税后收入(E)<Tooltip title="2.5%服务费+7.5%税费">？</Tooltip></div>,
    dataIndex: 'totalIncome',
    key: 'totalIncome2',
    align: 'right',
    // width: 80,
    render: (v, item) => {
      return (v / 10 ** 18) * 0.9.toFixed(5)
    }
  },

  {
    title: 'Gas(E)',
    dataIndex: 'totalGas',
    key: 'totalGas',
    align: 'right',
    // width: 80,
    render: (v, item) => {
      return (v / 10 ** 13).toFixed(5)
    }
  },
  {
    title: '税前收益(E)',
    dataIndex: 'currentProfits',
    key: 'currentProfits',
    align: 'right',
    // width: 80,
    render: (v, item) => {
      return (v / 10 ** 18).toFixed(5)
    }
  },
  {
    title: <div>税后收益(E)<Tooltip title="2.5%服务费+7.5%税费+Gas费">？</Tooltip></div>,
    dataIndex: 'currentProfits',
    key: 'currentProfits2',
    align: 'right',
    // width: 80,
    render: (v, item) => {
      return ((item.totalExpense - (item.totalIncome) * 0.9 - item.totalGas) / 10 ** 18).toFixed(5)
    }
  },


];

export default function App(props) {

  const QUERY_ID =  gql`
  query  fn($id:ID!){
    users(where: { owner: $id },first:1) {
      id
      totalActions
      totalGas
      totalIncome
      totalExpense
      currentProfits
      hold
    }
  }
`;



  const [value, setValue] = useState(1);

  const [QUERY, setQUERY] = useState(QUERY1);

  const [addrs, setAddrs] = useState("");



  const { data, loading, error, refetch } = useQuery(QUERY, {
    variables:{
      id: addrs
    },

  });

  const onSearch = (value) => {
    // console.log
    // refetch({ query: QUERY_ID(value),id:33 })
    setValue(0)
    setAddrs(value)
    setQUERY(
      QUERY_ID,
      {
        variables:{
          id:value
        }
      }
      )
  }

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    console.error(error);
    return null;
  }

  const onChange = (e) => {
    setValue(e.target.value);
    const newQUERY = e.target.value == 1 ? QUERY1 : QUERY2
    setQUERY(newQUERY)
  };

  // console.log(data,'data')

  return (
    <div className={styles.container}>
      <Head>
        <title>Dr.ji 盈亏榜</title>
        <meta name="description" content="Dr.ji 盈亏榜" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Dr.ji 盈亏榜
        </h1>

        <div className={styles.grid} >
          <Radio.Group onChange={onChange} value={value}>
            <Radio.Button value={1}>血亏榜</Radio.Button>
            <Radio.Button value={2}>盈利榜</Radio.Button>
          </Radio.Group>
        </div>

        <div className={styles.grid}>
          <p>输入地址查询 </p>
          <Search placeholder="Ethereum address " allowClear onSearch={onSearch} enterButton />
        </div>

        <Table key={value} size="small" columns={columns} style={{ width: 1000, marginTop: 40 }} scroll={{ x: 400, y: 400 }} dataSource={data.users}

        />
      </main>

      <footer className={styles.footer}>
        <a
          href=""
          target="_blank"
          rel="noopener noreferrer"
        >
          Keep Building
        </a>
      </footer>
    </div>
  )
}

// export async function getServerSideProps() {
//   const { data } = await client.query({
//     query: gql`
//         query  {
//           users(skip:1, first:1000,orderBy :currentProfits,orderDirection:asc) {
//             id
//             totalActions
//             totalGas
//             totalIncome
//             totalExpense
//             currentProfits
//             hold
//           }
//         }
//       `,
//   });
//   console.log(data,'data')

//   return {
//     props: {
//       data: data,
//     },
//   };
// }




