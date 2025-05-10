import pkg from 'hardhat';
const { ethers } = pkg;

async function main() {
  // Obtener el contrato
  const MemexContract = await ethers.getContractFactory("MemexContract");
  
  // Dirección del tesoro (puedes cambiarla por la que prefieras)
  const treasuryAddress = "0x0000000000000000000000000000000000000000";
  
  // Desplegar el contrato
  const memex = await MemexContract.deploy(treasuryAddress);
  
  // Esperar a que se confirme el despliegue
  await memex.waitForDeployment();
  
  const address = await memex.getAddress();
  console.log(`MemexContract desplegado en: ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 