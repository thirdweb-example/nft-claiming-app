import {
  ConnectWallet,
  embeddedWallet,
  localWallet,
  metamaskWallet,
  rainbowWallet,
  ThirdwebProvider,
  trustWallet,
  useAddress,
  useContract,
  useContractMetadata,
  useNFTBalance,
  walletConnect,
  Web3Button,
} from "@thirdweb-dev/react-native";
import { default as React } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const App = () => {
  return (
    <ThirdwebProvider
      activeChain="goerli"
      clientId={process.env.EXPO_PUBLIC_TW_CLIENT_ID}
      supportedWallets={[
        metamaskWallet({
          recommended: true,
        }),
        rainbowWallet(),
        walletConnect({
          recommended: true,
        }),
        embeddedWallet({
          auth: {
            options: ["email", "google"],
            redirectUrl: "rnstarter://",
          },
        }),
        trustWallet(),
        localWallet(),
      ]}
    >
      <AppInner />
    </ThirdwebProvider>
  );
};

const AppInner = () => {
  const address = useAddress();
  const contractAddress = "0x46EF402f8b80419B30a3912bCD27E7d219eBd3F1";
  const { contract } = useContract(contractAddress, "nft-drop");
  const { data: contractMetadata } = useContractMetadata(contract);
  const { data: nftBalance } = useNFTBalance(contract, address);

  return (
    <View style={styles.view}>
      {address && <ConnectWallet />}

      <View style={styles.nftCard}>
        <Image
          style={styles.nftImage}
          source={{
            uri: contractMetadata?.image,
          }}
        />
        <Text style={styles.title}>{contractMetadata?.name}</Text>
        <Text style={styles.descriptionText}>
          {contractMetadata?.description}
        </Text>

        <Text>You own: {nftBalance && nftBalance?.toNumber() | 0} NFT(s)</Text>
      </View>

      <Web3Button
        contractAddress={contractAddress}
        action={(contract) => contract.erc721.claim(1)}
      >
        Claim
      </Web3Button>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  nftCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    margin: 20,
    alignItems: "center",
  },
  nftImage: {
    width: 200,
    height: 200,
    alignSelf: "center",
    marginVertical: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 16,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default App;
