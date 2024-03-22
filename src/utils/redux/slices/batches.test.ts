import { batchesActions } from "./batches";
import {
  mockDelegationOperation,
  mockImplicitAccount,
  mockNftOperation,
  mockTezOperation,
} from "../../../mocks/factories";
import { ImplicitOperations, makeAccountOperations } from "../../../types/AccountOperations";
import { DefaultNetworks, Network } from "../../../types/Network";
import { Operation } from "../../../types/Operation";
import { store } from "../store";

const { add, clear, removeItem, removeByAccounts } = batchesActions;

describe("batchesSlice", () => {
  describe.each(DefaultNetworks)("on $name", network => {
    const anotherNetwork = DefaultNetworks.find(n => n.name !== network.name) as Network;

    describe("add", () => {
      it("can add operations to a non-existing batch", () => {
        const accountOperations = makeAccountOperations(
          mockImplicitAccount(1),
          mockImplicitAccount(1),
          [mockTezOperation(0)]
        );
        store.dispatch(add({ operations: accountOperations, network }));

        expect(store.getState().batches[network.name]).toEqual([accountOperations]);
      });

      it("can add new operations to the same account", () => {
        const transfers: Operation[] = [];

        for (const operation of [
          mockTezOperation(1),
          mockDelegationOperation(1),
          mockNftOperation(1),
        ]) {
          const accountOperations = makeAccountOperations(
            mockImplicitAccount(1),
            mockImplicitAccount(1),
            [operation]
          );
          store.dispatch(add({ operations: accountOperations, network }));
          transfers.push(operation);

          expect(store.getState().batches[network.name]).toEqual([
            makeAccountOperations(mockImplicitAccount(1), mockImplicitAccount(1), transfers),
          ]);
        }
      });

      it("can add operations to different sender accounts", () => {
        const accountOperations = makeAccountOperations(
          mockImplicitAccount(1),
          mockImplicitAccount(1),
          [mockTezOperation(0)]
        ) as ImplicitOperations;
        store.dispatch(add({ operations: accountOperations, network }));
        const anotherAccountFormOperations = {
          ...accountOperations,
          sender: mockImplicitAccount(2),
        };
        store.dispatch(add({ operations: anotherAccountFormOperations, network }));

        expect(store.getState().batches[network.name]).toEqual([
          accountOperations,
          anotherAccountFormOperations,
        ]);
      });
    });

    describe("clear", () => {
      it("removes everything under a given account", () => {
        const accountOperations = makeAccountOperations(
          mockImplicitAccount(1),
          mockImplicitAccount(1),
          [mockTezOperation(0), mockDelegationOperation(0), mockNftOperation(0)]
        );
        const pkh = mockImplicitAccount(1).address.pkh;
        store.dispatch(add({ operations: accountOperations, network }));

        expect(store.getState().batches[network.name]).toEqual([accountOperations]);

        store.dispatch(clear({ pkh, network }));

        expect(store.getState().batches[network.name]).toEqual([]);
      });

      it("does nothing if the batch is on another network", () => {
        const accountOperations = makeAccountOperations(
          mockImplicitAccount(1),
          mockImplicitAccount(1),
          [mockTezOperation(0), mockDelegationOperation(0), mockNftOperation(0)]
        );
        const pkh = mockImplicitAccount(1).address.pkh;
        store.dispatch(add({ operations: accountOperations, network }));
        store.dispatch(add({ operations: accountOperations, network: anotherNetwork }));

        expect(store.getState().batches[network.name]).toEqual([accountOperations]);
        expect(store.getState().batches[anotherNetwork.name]).toEqual([accountOperations]);

        store.dispatch(clear({ pkh, network }));

        expect(store.getState().batches[network.name]).toEqual([]);
        expect(store.getState().batches[anotherNetwork.name]).toEqual([accountOperations]);
      });
    });

    describe("removeItem", () => {
      it("removes the whole batch if there is just one operation", () => {
        const accountOperations = makeAccountOperations(
          mockImplicitAccount(1),
          mockImplicitAccount(1),
          [mockTezOperation(0)]
        );
        const pkh = mockImplicitAccount(1).address.pkh;
        store.dispatch(add({ operations: accountOperations, network }));

        expect(store.getState().batches[network.name]).toEqual([accountOperations]);

        store.dispatch(removeItem({ pkh, index: 0, network }));

        expect(store.getState().batches[network.name]).toEqual([]);
      });

      it("removes the operation at the given index", () => {
        const accountOperations = makeAccountOperations(
          mockImplicitAccount(1),
          mockImplicitAccount(1),
          [mockTezOperation(0), mockDelegationOperation(0), mockNftOperation(0)]
        );
        const pkh = mockImplicitAccount(1).address.pkh;
        store.dispatch(add({ operations: accountOperations, network }));

        expect(store.getState().batches[network.name]).toEqual([accountOperations]);

        store.dispatch(removeItem({ pkh, index: 1, network }));
        const newFormOperations = {
          ...accountOperations,
          operations: [mockTezOperation(0), mockNftOperation(0)],
        };

        expect(store.getState().batches[network.name]).toEqual([newFormOperations]);
      });

      it("does nothing if the index is out of bounds", () => {
        const accountOperations = makeAccountOperations(
          mockImplicitAccount(1),
          mockImplicitAccount(1),
          [mockTezOperation(0)]
        );
        const pkh = mockImplicitAccount(1).address.pkh;
        store.dispatch(add({ operations: accountOperations, network }));

        expect(store.getState().batches[network.name]).toEqual([accountOperations]);

        store.dispatch(removeItem({ pkh, index: 5, network }));

        expect(store.getState().batches[network.name]).toEqual([accountOperations]);
      });

      it("does nothing if the batch does not exist", () => {
        const accountOperations = makeAccountOperations(
          mockImplicitAccount(1),
          mockImplicitAccount(1),
          [mockTezOperation(0)]
        );
        store.dispatch(add({ operations: accountOperations, network }));

        expect(store.getState().batches[network.name]).toEqual([accountOperations]);

        store.dispatch(removeItem({ pkh: mockImplicitAccount(2).address.pkh, index: 5, network }));

        expect(store.getState().batches[network.name]).toEqual([accountOperations]);
      });
    });

    describe("removeByAccounts", () => {
      it("does nothing if there is no batches for the accounts", () => {
        const accountOperations = makeAccountOperations(
          mockImplicitAccount(1),
          mockImplicitAccount(1),
          [mockTezOperation(0), mockTezOperation(1)]
        );
        store.dispatch(add({ operations: accountOperations, network }));

        store.dispatch(removeByAccounts([mockImplicitAccount(2).address.pkh]));

        expect(store.getState().batches[network.name]).toEqual([accountOperations]);
      });

      it("removes batches for all listed accounts", () => {
        const accountOperations1 = makeAccountOperations(
          mockImplicitAccount(1),
          mockImplicitAccount(1),
          [mockTezOperation(0), mockTezOperation(1)]
        );
        const accountOperations2 = makeAccountOperations(
          mockImplicitAccount(2),
          mockImplicitAccount(2),
          [mockTezOperation(1), mockTezOperation(3)]
        );
        const accountOperations3 = makeAccountOperations(
          mockImplicitAccount(3),
          mockImplicitAccount(3),
          [mockTezOperation(0)]
        );
        store.dispatch(add({ operations: accountOperations1, network }));
        store.dispatch(add({ operations: accountOperations2, network }));
        store.dispatch(add({ operations: accountOperations3, network }));

        store.dispatch(
          removeByAccounts([mockImplicitAccount(2).address.pkh, mockImplicitAccount(3).address.pkh])
        );

        expect(store.getState().batches[network.name]).toEqual([accountOperations1]);
      });

      it("removes batches from all networks", () => {
        const accountOperations1 = makeAccountOperations(
          mockImplicitAccount(1),
          mockImplicitAccount(1),
          [mockTezOperation(0), mockTezOperation(1)]
        );
        const accountOperations2 = makeAccountOperations(
          mockImplicitAccount(2),
          mockImplicitAccount(2),
          [mockTezOperation(1), mockTezOperation(3)]
        );
        store.dispatch(add({ operations: accountOperations1, network }));
        store.dispatch(add({ operations: accountOperations2, network }));
        store.dispatch(add({ operations: accountOperations1, network: anotherNetwork }));
        store.dispatch(add({ operations: accountOperations2, network: anotherNetwork }));

        store.dispatch(removeByAccounts([mockImplicitAccount(2).address.pkh]));

        expect(store.getState().batches[network.name]).toEqual([accountOperations1]);
        expect(store.getState().batches[anotherNetwork.name]).toEqual([accountOperations1]);
      });
    });
  });
});
