import { ImplicitOperations, makeAccountOperations } from "../../../types/AccountOperations";
import {
  mockDelegationOperation,
  mockImplicitAccount,
  mockNftOperation,
  mockTezOperation,
} from "../../../mocks/factories";
import { waitFor } from "../../../mocks/testUtils";
import { DefaultNetworks, Network } from "../../../types/Network";
import { Operation } from "../../../types/Operation";
import store from "../store";
import { batchesActions } from "./batches";

const { add, clear, removeItem } = batchesActions;

describe("batchesSlice", () => {
  describe.each(DefaultNetworks)("on $name", network => {
    const anotherNetwork = DefaultNetworks.find(n => n.name !== network.name) as Network;

    describe("add", () => {
      it("can add operations to a non-existing batch", async () => {
        const accountOperations = makeAccountOperations(
          mockImplicitAccount(1),
          mockImplicitAccount(1),
          [mockTezOperation(0)]
        );
        store.dispatch(add({ operations: accountOperations, network }));
        await waitFor(() => {
          expect(store.getState().batches[network.name]).toEqual([accountOperations]);
        });
      });

      it("can add new operations to the same account", async () => {
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

          await waitFor(() => {
            expect(store.getState().batches[network.name]).toEqual([
              makeAccountOperations(mockImplicitAccount(1), mockImplicitAccount(1), transfers),
            ]);
          });
        }
      });

      it("can add operations to different sender accounts", async () => {
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
        await waitFor(() => {
          expect(store.getState().batches[network.name]).toEqual([
            accountOperations,
            anotherAccountFormOperations,
          ]);
        });
      });
    });

    describe("clear", () => {
      it("removes everything under a given account", async () => {
        const accountOperations = makeAccountOperations(
          mockImplicitAccount(1),
          mockImplicitAccount(1),
          [mockTezOperation(0), mockDelegationOperation(0), mockNftOperation(0)]
        );
        const pkh = mockImplicitAccount(1).address.pkh;
        store.dispatch(add({ operations: accountOperations, network }));
        await waitFor(() => {
          expect(store.getState().batches[network.name]).toEqual([accountOperations]);
        });
        store.dispatch(clear({ pkh, network }));
        await waitFor(() => {
          expect(store.getState().batches[network.name]).toEqual([]);
        });
      });

      it("does nothing if the batch is on another network", async () => {
        const accountOperations = makeAccountOperations(
          mockImplicitAccount(1),
          mockImplicitAccount(1),
          [mockTezOperation(0), mockDelegationOperation(0), mockNftOperation(0)]
        );
        const pkh = mockImplicitAccount(1).address.pkh;
        store.dispatch(add({ operations: accountOperations, network }));
        store.dispatch(add({ operations: accountOperations, network: anotherNetwork }));

        await waitFor(() => {
          expect(store.getState().batches[network.name]).toEqual([accountOperations]);
        });
        expect(store.getState().batches[anotherNetwork.name]).toEqual([accountOperations]);
        store.dispatch(clear({ pkh, network }));
        await waitFor(() => {
          expect(store.getState().batches[network.name]).toEqual([]);
        });
        expect(store.getState().batches[anotherNetwork.name]).toEqual([accountOperations]);
      });
    });

    describe("removeItem", () => {
      it("removes the whole batch if there is just one operation", async () => {
        const accountOperations = makeAccountOperations(
          mockImplicitAccount(1),
          mockImplicitAccount(1),
          [mockTezOperation(0)]
        );
        const pkh = mockImplicitAccount(1).address.pkh;
        store.dispatch(add({ operations: accountOperations, network }));
        await waitFor(() => {
          expect(store.getState().batches[network.name]).toEqual([accountOperations]);
        });
        store.dispatch(removeItem({ pkh, index: 0, network }));
        await waitFor(() => {
          expect(store.getState().batches[network.name]).toEqual([]);
        });
      });

      it("removes the operation at the given index", async () => {
        const accountOperations = makeAccountOperations(
          mockImplicitAccount(1),
          mockImplicitAccount(1),
          [mockTezOperation(0), mockDelegationOperation(0), mockNftOperation(0)]
        );
        const pkh = mockImplicitAccount(1).address.pkh;
        store.dispatch(add({ operations: accountOperations, network }));
        await waitFor(() => {
          expect(store.getState().batches[network.name]).toEqual([accountOperations]);
        });
        store.dispatch(removeItem({ pkh, index: 1, network }));
        const newFormOperations = {
          ...accountOperations,
          operations: [mockTezOperation(0), mockNftOperation(0)],
        };
        await waitFor(() => {
          expect(store.getState().batches[network.name]).toEqual([newFormOperations]);
        });
      });

      it("does nothing if the index is out of bounds", async () => {
        const accountOperations = makeAccountOperations(
          mockImplicitAccount(1),
          mockImplicitAccount(1),
          [mockTezOperation(0)]
        );
        const pkh = mockImplicitAccount(1).address.pkh;
        store.dispatch(add({ operations: accountOperations, network }));
        await waitFor(() => {
          expect(store.getState().batches[network.name]).toEqual([accountOperations]);
        });
        store.dispatch(removeItem({ pkh, index: 5, network }));
        await waitFor(() => {
          expect(store.getState().batches[network.name]).toEqual([accountOperations]);
        });
      });

      it("does nothing if the batch does not exist", async () => {
        const accountOperations = makeAccountOperations(
          mockImplicitAccount(1),
          mockImplicitAccount(1),
          [mockTezOperation(0)]
        );
        store.dispatch(add({ operations: accountOperations, network }));
        await waitFor(() => {
          expect(store.getState().batches[network.name]).toEqual([accountOperations]);
        });

        store.dispatch(removeItem({ pkh: mockImplicitAccount(2).address.pkh, index: 5, network }));
        await waitFor(() => {
          expect(store.getState().batches[network.name]).toEqual([accountOperations]);
        });
      });
    });
  });
});
