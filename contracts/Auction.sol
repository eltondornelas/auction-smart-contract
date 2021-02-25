pragma solidity ^0.7.4;

contract Auction {

    enum State {
        Progress,
        Fail,
        Success,
        Paid
    }

    string public name;  // pode ter diversos leilões
    uint public targetAmount;  // lance alvo
    uint public deadline;  //  prazo final
    address payable public beneficiary; // qualquer pessoa na blockchain possui uma wallet, por isso, address
    State public state;

    constructor (
        string memory contractName,
        uint targetAmountEth, // lembrar de confirmar qual o tipo da moeda da blockchain
        uint durationInMin,
        address payable beneficiaryAddress) 
        
    public {
        name = contractName;
        targetAmount = etherToWei(targetAmountEth);
        deadline = currentTime() + minutesToSeconds(durationInMin);
        // deadline = now + minutesToSeconds(durationInMin);
        // deadline = block.timestamp + minutesToSeconds(durationInMin);
        beneficiary = beneficiaryAddress;
        state = State.Progress;
    }

    function etherToWei(uint sumInEth) public pure returns(uint) {
        return sumInEth * 1 ether;
    }

    function minutesToSeconds(uint timeInMin) public pure returns(uint) {
        return timeInMin * 1 minutes;
        // na blockchain grava o tempo em segundos
    }
}