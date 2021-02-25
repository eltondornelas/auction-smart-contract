pragma solidity ^0.7.4;

import "./Util.sol";

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
        targetAmount = Util.etherToWei(targetAmountEth);
        // deadline = currentTime() + minutesToSeconds(durationInMin);  // no Curso utilizou assim, mas compilador não reconhece
        // deadline = now + minutesToSeconds(durationInMin);  // deprecated
        deadline = block.timestamp + Util.minutesToSeconds(durationInMin);
        beneficiary = beneficiaryAddress;
        state = State.Progress;
    }

}