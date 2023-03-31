import "./App.css";
import Home from "./components/home";
import { Jobs } from "./components/Jobs";
import { useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";
import jobBoard from "./contracts/jobBoard.abi.json";


const ERC20_DECIMALS = 18;
const contractAddress = "0x31375CB4f0e144E36F9de58C2085C0F0A0CF6627";


function App() {
  const [contract, setcontract] = useState(null);
  const [address, setAddress] = useState(null);
  const [kit, setKit] = useState(null);
  const [cUSDBalance, setcUSDBalance] = useState(0);
  const [jobs, setJobs] = useState([]);

  const connectToWallet = async () => {
    if (window.celo) {
      try {
        await window.celo.enable();
        const web3 = new Web3(window.celo);
        let kit = newKitFromWeb3(web3);

        const accounts = await kit.web3.eth.getAccounts();
        const user_address = accounts[0];
        kit.defaultAccount = user_address;

        await setAddress(user_address);
        await setKit(kit);
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Error Occurred");
    }
  };

  const getBalance = useCallback(async () => {
    try {
      const balance = await kit.getTotalBalance(address);
      const USDBalance = balance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2);

      const contract = new kit.web3.eth.Contract(jobBoard, contractAddress);
      setcontract(contract);
      setcUSDBalance(USDBalance);
    } catch (error) {
      console.log(error);
    }
  }, [address, kit]);

  const getJobs = useCallback(async () => {
    const jobsLength = await contract.methods.getJobsLength().call();
    const jobs = [];
    for (let index = 0; index < jobsLength; index++) {
      let _jobs = new Promise(async (resolve, reject) => {
        let job = await contract.methods.getJobposts(index).call();

        resolve({
          index: index,
          jobId: job[0],
          employer: job[1],
          jobName: job[2],
          jobDescription: job[3],
          salary: job[4],
        });
      });
      jobs.push(_jobs);
    }

    const _jobs = await Promise.all(jobs);
    setJobs(_jobs);
  }, [contract]);

  const addJob = async (_jobName, _jobDescription, _salary) => {
    try {
      await contract.methods
        .postJob(_jobName, _jobDescription, _salary)
        .send({ from: address });
      getJobs();
    } catch (error) {
      alert(error);
    }
  };

  const removeJob = async (_index) => {
    try {
      await contract.methods
        .removeJobPost(_index)
        .send({ from: address });
      getJobs();
      getBalance();
      alert("you have successfully removed the job");
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    connectToWallet();
  }, []);

  useEffect(() => {
    if (kit && address) {
      getBalance();
    }
  }, [kit, address, getBalance]);

  useEffect(() => {
    if (contract) {
      getJobs();
    }
  }, [contract, getJobs]);

  return (
    <div className="App">
      <Home cUSDBalance={cUSDBalance} addJob={addJob} />
      <Jobs
        jobs={jobs}
        removeJob={removeJob}
        walletAddress={address}
      />
    </div>
  );
}

export default App;
