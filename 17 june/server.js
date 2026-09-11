require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { ethers } = require("ethers");

const app = express();
const port = Number(process.env.PORT || 4444);
const rpcUrl = process.env.RPC_URL || "http://127.0.0.1:8545";
const deploymentPath = path.join(__dirname, "deployment.json");

const abi = [
  "function createRecord(string name, string content) returns (uint256)",
  "function getRecords() view returns ((uint256 id, address owner, string name, string content, uint256 createdAt)[])",
];

function getContract() {
  if (!process.env.PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY is required. Copy .env.example to .env.");
  }
  if (!fs.existsSync(deploymentPath)) {
    throw new Error("Contract is not deployed. Run npm run deploy first.");
  }

  const { address } = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  return new ethers.Contract(address, abi, wallet);
}

app.use(cors());
app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", async (req, res) => {
  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    res.json({ ok: true, network: (await provider.getNetwork()).chainId.toString() });
  } catch (error) {
    res.status(503).json({ error: error.message });
  }
});

app.get("/api/records", async (req, res) => {
  try {
    const records = await getContract().getRecords();
    res.json(records.map((record) => ({
      id: record.id.toString(),
      owner: record.owner,
      name: record.name,
      content: record.content,
      createdAt: new Date(Number(record.createdAt) * 1000).toISOString(),
    })));
  } catch (error) {
    res.status(503).json({ error: error.message });
  }
});

app.post("/api/records", async (req, res) => {
  const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
  const content = typeof req.body.content === "string" ? req.body.content.trim() : "";
  if (!name || !content || name.length > 80 || content.length > 500) {
    return res.status(400).json({ error: "Name and content are required (80 and 500 characters max)." });
  }

  try {
    const transaction = await getContract().createRecord(name, content);
    const receipt = await transaction.wait();
    res.status(201).json({ transactionHash: receipt.hash });
  } catch (error) {
    res.status(502).json({ error: error.shortMessage || error.message });
  }
});

app.listen(port, () => {
  console.log(`Registry dApp running at http://localhost:${port}`);
});
