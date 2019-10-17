#!/bin/node
const { promises: fs, constants } = require('fs');
const path = require('path');
const merge = require('deepmerge');

fs.constants = constants;

const root = path.dirname(__dirname);
const deployedContractsDir = path.join(root, 'build', 'contracts');
const infoFile = path.join(root, 'contracts.json');

async function readBuildData() {
  const contractFiles = await fs.readdir(deployedContractsDir);
  const contractFilePaths = contractFiles.map(contract =>
    path.join(deployedContractsDir, contract)
  );

  return Promise.all(
    contractFilePaths.map(async filePath =>
      JSON.parse(await fs.readFile(filePath, { encoding: 'utf8' }))
    )
  );
}

function extractNewInfoFromBuildData(parsedContracts) {
  const extractAddressesByNetowrkId = networkData =>
    Object.entries(networkData).reduce(
      (addrAcc, [networkId, networkInfo]) =>
        Object.assign(addrAcc, {
          [networkId]: networkInfo.address,
        }),
      {}
    );

  const extractContractData = contractData => ({
    [contractData.contractName]: {
      abi: contractData.abi,
      addresses: extractAddressesByNetowrkId(contractData.networks),
    },
  });

  return parsedContracts.reduce(
    (acc, contractData) =>
      Object.assign(acc, extractContractData(contractData)),
    {}
  );
}

async function readCurrentInfo() {
  try {
    await fs.access(infoFile, fs.constants.R_OK);

    const content = await fs.readFile(infoFile, { encoding: 'utf8' });
    return JSON.parse(content);
  } catch (err) {
    return {};
  }
}

function mergeInfo(currentInfo, newInfo) {
  const overwriteMerge = (dstArray, srcArray) => srcArray;
  return merge(currentInfo, newInfo, { arrayMerge: overwriteMerge });
}

async function run() {
  const currentInfo = await readCurrentInfo();
  const newInfo = extractNewInfoFromBuildData(await readBuildData());

  const mergedInfo = mergeInfo(currentInfo, newInfo);
  fs.writeFile(infoFile, JSON.stringify(mergedInfo, null, 2));
}

run();
