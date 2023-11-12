import React from "react";
import { ConnectWallet } from "@thirdweb-dev/react";
import { useSession, signIn } from "next-auth/react";
import styles from "../styles/Home.module.css";

const Login = () => {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className={styles.container}>
        <h1>Twitter Verified Rewards</h1>
        <p>
          Claim an NFT if you have been verified on Twitter.
        </p>
        {/* add a twitter logo here.*/}
        <button className={styles.mainButton} onClick={() => signIn()}>
          Sign in with Twitter
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>Twitter Verified Rewards</h1>
      <p>
        Claim an NFT if you have been verified on Twitter.
      </p>
      <ConnectWallet
        auth={{
          loginOptional: false,
        }}
      />
    </div>
  );
};

export default Login;
