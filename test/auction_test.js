let AuctionDeadline = artifacts.require('./AuctionTest')
const BigNumber = require('bignumber.js')

contract('Auction', function(accounts) {

    let contract;
    let contractCreator = accounts[0];
    let beneficiary = accounts[1];

    const ONE_ETH = new BigNumber(1000000000000000000);  // 1 ether na unidade wei
    const ERROR_MSG = 'Returned error: VM Exception while processing transaction: revert';
    const PROGRESS_STATE = 0;
    const FAILED_STATE = 1;
    const SUCCEEDED_STATE = 2;
    const PAID_OUT_STATE = 3;

    beforeEach(async function() {
        contract = await AuctionDeadline.new('funding', 1, 10, beneficiary, {from: contractCreator, gas: 2000000});
    });

    // it => é a validação da regra
    it('Contrato Inicializado.', async function() {
        let contractName = await contract.name.call()
        expect(contractName).to.equal('funding');

        let targetAmount = await contract.targetAmount.call()
        expect(ONE_ETH.isEqualTo(targetAmount)).to.equal(true);

        let deadline = await contract.deadline.call()
        expect(deadline.toNumber()).to.equal(600);

        let actualBeneficiary = await contract.beneficiary.call()
        expect(actualBeneficiary).to.equal(beneficiary);

        let state = await contract.state.call()
        expect(state.valueOf().toNumber()).to.equal(PROGRESS_STATE);
    });

    it('Lances realizados.', async function() {
        await contract.contribute({value: ONE_ETH, from: contractCreator});

        let contributed = await contract.amounts.call(contractCreator);
        expect(ONE_ETH.isEqualTo(contributed)).to.equal(true);

        let totalCollected = await contract.totalCollected.call();
        expect(ONE_ETH.isEqualTo(totalCollected)).to.equal(true);
    });

    it('Não pode efetuar lance após o deadline.', async function() {
        try {
            await contract.setCurrentTime(601);
            await contract.sendTransaction({
                value: ONE_ETH,
                from: contractCreator
            });
            expect.fail();
        } catch (error) {
            expect(error.message).to.equal(ERROR_MSG);
        }
    })

    it('Leilão Concluído Com Sucesso.', async function() {
        await contract.contribute({value: ONE_ETH, from: contractCreator});
        await contract.setCurrentTime(601);
        await contract.finishAuction();
        let state = await contract.state.call();

        expect(state.valueOf().toNumber()).to.equal(SUCCEEDED_STATE);
    });

    it('Leilão Falhou. Sem Vencedor.', async function() {
        await contract.setCurrentTime(601);
        await contract.finishAuction();
        let state = await contract.state.call();

        expect(state.valueOf().toNumber()).to.equal(FAILED_STATE);
    });

    it('Coletando dinheiro pago pelo vencedor.', async function() {
        await contract.contribute({value: ONE_ETH, from: contractCreator});
        await contract.setCurrentTime(601);
        await contract.finishAuction();

        let initAmount = await web3.eth.getBalance(beneficiary);
        await contract.collect({from: contractCreator});

        let newBalance = await web3.eth.getBalance(beneficiary);
        let difference = newBalance - initAmount;
        expect(ONE_ETH.isEqualTo(difference)).to.equal(true);

        let fundingState = await contract.state.call()
        expect(fundingState.valueOf().toNumber()).to.equal(PAID_OUT_STATE);
    });

    it('Coletando fundos do contrato.', async function() {
        await contract.contribute({value: ONE_ETH - 100, from: contractCreator});
        await contract.setCurrentTime(601);
        await contract.finishAuction();

        await contract.withdraw({from: contractCreator});
        let amount = await contract.amounts.call(contractCreator);
        expect(amount.toNumber()).to.equal(0);
    });

    it('Evento emitido', async function() {
        await contract.setCurrentTime(601);
        const transaction = await contract.finishAuction();

        const events = transaction.logs
        expect(events.length).to.equal(1);

        const event = events[0]
        expect(event.args.totalCollected.toNumber()).to.equal(0);
        expect(event.args.succeeded).to.equal(false);
    });

});
