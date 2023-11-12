import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { getUser } from "../../auth.config";
// import GithubContributor from "../../types/GithubContributor";
// import GithubRepo from "../../types/GithubRepo";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { authOptions } from "./auth/[...nextauth]";


const claimNft = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  // 1. Verify the user with NextAuth (their Twitter account)
  const session = await unstable_getServerSession(req, res, authOptions);
  // 2. Verify the user using thirdweb Auth
  const thirdwebUser = await getUser(req);

  //3.
  // TODO check for verified against Twitter API

  // Get the user info
  // Make sure user is verified
  // pull profile image down
  // Get other info ???

  if (!session || !thirdwebUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Set to true if they are verified
  // TODO set to false when not testing
  let isVerified = true;

  if (!isVerified) {
    return res.status(401).json({ message: "Sorry, you don't qualify" });
  }

  const sdk = ThirdwebSDK.fromPrivateKey(
    process.env.PRIVATE_KEY as string,
    "goerli" // configure this to your network
  );

  // NFT Contract
  const edition = await sdk.getContract(process.env.CONTRACT_ADDRESS, 'edition');

  const balance = await edition.balanceOf(thirdwebUser.address, 0);

  // If you already have one, you can't mint again.
  if (balance.gt(0)) {
    return res.status(401).json({ message: "You already have an NFT" });
  }

  // 4. If they are verified and have wallet, call the generateFromTokenId from the Edition contract.
  const signedPayload = await edition.signature.generateFromTokenId({
    quantity: 1,
    tokenId: 0,
    to: thirdwebUser.address,
  });

  return res.status(200).json({ signedPayload });
};

export default claimNft;
