import * as React from "react";

import {
  useConnect,
  useAccount,
  useNetwork,
  useSigner,
  useProvider,
  useContract,
  useContractWrite,
  useContractRead
} from "wagmi";

import StorageAbi from "./abi/StorageAbi.json";

export const App = () => {
  const StorageContractAddressTestnet =
    "0x731A2F83142c6CA12aF26C5E7f7bc3a4e69A48E0";
  const provider = useProvider();

  const [{ signer, err, loadsig }, getSigner] = useSigner();
  const contract = useContract({
    addressOrName: StorageContractAddressTestnet,
    contractInterface: StorageAbi,
    signerOrProvider: provider
  });
  const [
    {
      data: { connector, connectors },
      errorConnect,
      loadingConnect
    },
    connect
  ] = useConnect();
  const [{ data: accountData }, disconnect] = useAccount();
  const [
    { data: networkData, error: networkError },
    switchNetwork
  ] = useNetwork();
  const [
    { data: nb, loading: nbLoad, error: nbError },
    write
  ] = useContractWrite(
    {
      addressOrName: StorageContractAddressTestnet,
      contractInterface: StorageAbi
    },
    "store",
    {
      args: "912"
    }
  );
  const [
    { data: nbr, loading: nbrLoad, error: nbrError },
    read
  ] = useContractRead(
    {
      addressOrName: StorageContractAddressTestnet,
      contractInterface: StorageAbi
    },
    "retrieve"
  );
  if (accountData) {
    console.debug({
      Connection: connector,
      Provider: provider,
      Signer: signer,
      Network: networkData,
      storageContract: contract,
      StorageAbi: StorageAbi,
      contract: contract,
      write: useContractWrite
    });
    return (
      <div>
        <p>Account address: {accountData.address}</p>
        <p>Connected to {networkData.chain?.name}</p>
        <p>Connected via {accountData.connector?.name}</p>
        <button
          onClick={async function () {
            console.log("Waiting updating data");
            write()
              .then((rp) => console.log({ writeresult: rp }))
              .catch((err) => console.error(err));
          }}
        >
          SetStorage
        </button>
        <button onClick={disconnect}>Disconnect</button>
        <button
          onClick={async function readNb() {
            read()
              .then((rp) => console.log({ readresult: rp }))
              .catch((err) => console.error(err));
          }}
        >
          Read
        </button>
      </div>
    );
  }

  return (
    <div>
      <div>
        {connectors.map((x) => (
          <button
            disabled={!x.ready}
            key={x.name}
            onClick={async function () {
              connect(x)
                .then((rep) => {
                  console.log({ connexion: rep });
                })
                .catch((err) => console.error({ message: err }));
            }}
          >
            {x.name}
            {!x.ready && " (unsupported)"}
            {loadingConnect && x.name === connector?.name && "…"}
          </button>
        ))}
      </div>
      <div>
        {errorConnect && (errorConnect?.message ?? "Failed to connect")}
      </div>
    </div>
  );
};
