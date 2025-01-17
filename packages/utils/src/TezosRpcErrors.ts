// Generated from https://tezos.gitlab.io/api/errors.html
// by fetching source page and manual tag replacement

export const TezosRpcErrors = {
  Badly_formed_constant_expression: {
    description:
      "Badly formed constant expression. Found a badly formed constant expression. The 'constant' primitive must always be followed by a string of the hash of the expression it points to. ",
    category: "temporary",
  },
  "Bounded_history_repr.Smart_rollup_inbox_history.key_bound_to_different_value": {
    description:
      "Key already bound to a different value. Smart_rollup_inbox_history: Remember called with a key that is already bound to a different value. ",
    category: "temporary",
  },
  "Bounded_history_repr.Smart_rollup_level_inbox_history.key_bound_to_different_value": {
    description:
      "Key already bound to a different value. Smart_rollup_level_inbox_history: Remember called with a key that is already bound to a different value. ",
    category: "temporary",
  },
  "Bounded_history_repr.dal_slots_cache.key_bound_to_different_value": {
    description:
      "Key already bound to a different value. Remember called with a key that is already bound to a different value. ",
    category: "temporary",
  },
  Dal_data_availibility_attester_not_in_committee: {
    description:
      "The attester is not part of the DAL committee for this level. The attester is not part of the DAL committee for this level ",
    category: "temporary",
  },
  "Dal_slot_repr.add_element_in_slots_skip_list_violates_ordering": {
    description:
      "Add an element in slots skip list that violates ordering. Attempting to add an element on top of the Dal confirmed slots skip list that violates the ordering. ",
    category: "temporary",
  },
  "Dal_slot_repr.invalid_proof_deserialization": {
    description:
      "Dal invalid proof deserialization. Error occured during dal proof deserialization ",
    category: "temporary",
  },
  "Dal_slot_repr.invalid_proof_serialization": {
    description: "Dal invalid proof serialization. Error occured during dal proof serialization ",
    category: "temporary",
  },
  Dissecting_during_final_move: {
    description:
      "Tried to play a dissecting when the final move started. Tried to play a dissecting when the final move started ",
    category: "temporary",
  },
  Dissection_choice_not_found: {
    description: "Dissection choice not found. Dissection choice not found ",
    category: "temporary",
  },
  Dissection_unexpected_section_size: {
    description:
      "The distance for a proof should be equal to 1. The distance for a proof should be equal to 1 ",
    category: "temporary",
  },
  Expected_binary_proof: {
    description: "Expected binary proof. An invalid proof has been submitted ",
    category: "temporary",
  },
  Expression_already_registered: {
    description:
      "Expression already registered. Attempted to register an expression as global constant that has already been registered. ",
    category: "temporary",
  },
  Expression_too_deep: {
    description:
      "Expression too deep. Attempted to register an expression that, after fully expanding all referenced global constants, would result in too many levels of nesting. ",
    category: "temporary",
  },
  Expression_too_large: {
    description:
      "Expression too large. Encountered an expression that, after expanding all constants, is larger than the expression size limit. ",
    category: "temporary",
  },
  Failed_to_get_script: {
    description:
      "Failed to get script for contract. Failed to get script for contract when scanning operations for tickets ",
    category: "temporary",
  },
  Failed_to_hash_node: {
    description: "Failed to hash node. Failed to hash node for a key in the ticket-balance table ",
    category: "temporary",
  },
  Failed_to_load_big_map_value_type: {
    description:
      "Failed to load big-map value type. Failed to load big-map value type when computing ticket diffs. ",
    category: "temporary",
  },
  Merkle_list_invalid_position: {
    description: "Invalid position in merkle list. Merkle_list_invalid_position ",
    category: "temporary",
  },
  Negative_ticket_balance: {
    description: "Negative ticket balance. Attempted to set a negative ticket balance value ",
    category: "temporary",
  },
  Nonexistent_global: {
    description:
      "Tried to look up nonexistent global. No registered global was found at the given hash in storage. ",
    category: "temporary",
  },
  Proof_start_state_hash_mismatch: {
    description:
      "The start state hash of the proof is invalid. The start state hash of the proof is invalid ",
    category: "temporary",
  },
  Proof_stop_state_hash_failed_to_refute: {
    description:
      "Failed to refute the stop state hash with the proof. Failed to refute the stop state hash with the proof ",
    category: "temporary",
  },
  Proof_stop_state_hash_failed_to_validate: {
    description:
      "Failed to validate the stop state hash with the proof. Failed to validate the stop state hash with the proof ",
    category: "temporary",
  },
  Unsupported_non_empty_overlay: {
    description: "Unsupported non empty overlay. Unsupported big-map value with non-empty overlay ",
    category: "temporary",
  },
  Unsupported_type_operation: {
    description: "Unsupported type operation. Types embedding operations are not supported ",
    category: "temporary",
  },
  Used_storage_underflow: {
    description:
      "Ticket balance used storage underflow. Attempt to free more bytes than allocated for the tickets balance ",
    category: "temporary",
  },
  "apply.missing_shell_header": {
    description:
      "Missing shell_header during finalisation of a block. During finalisation of a block header in Application mode or Full construction mode, a shell header should be provided so that a cache nonce can be computed. ",
    category: "temporary",
  },
  "baking.insufficient_attestation_power": {
    description:
      "Insufficient attestation power. The attestation power is insufficient to satisfy the consensus threshold. ",
    category: "temporary",
  },
  "block.multiple_revelation": {
    description:
      "Multiple revelations were included in a manager operation. A manager operation should not contain more than one revelation ",
    category: "temporary",
  },
  "block_header.invalid_block_signature": {
    description: "Invalid block signature. A block was not signed with the expected private key. ",
    category: "temporary",
  },
  "block_header.invalid_commitment": {
    description: "Invalid commitment in block header. The block header has invalid commitment. ",
    category: "temporary",
  },
  "block_header.invalid_payload_round": {
    description: "Invalid payload round. The given payload round is invalid. ",
    category: "temporary",
  },
  "block_header.invalid_stamp": {
    description:
      "Insufficient block proof-of-work stamp. The block's proof-of-work stamp is insufficient ",
    category: "temporary",
  },
  "block_header.wrong_timestamp": {
    description: "Wrong timestamp. Block timestamp not the expected one. ",
    category: "temporary",
  },
  "bootstrap.unrevealed_public_key": {
    description:
      "Forbidden delegation from unrevealed public key. Tried to delegate from an unrevealed public key ",
    category: "temporary",
  },
  cannot_retrieve_predecessor_level: {
    description: "Cannot retrieve predecessor level. Cannot retrieve predecessor level. ",
    category: "temporary",
  },
  "constants.invalid_protocol_constants": {
    description: "Invalid protocol constants. The provided protocol constants are not coherent. ",
    category: "temporary",
  },
  "context.failed_to_decode_parameter": {
    description: "Failed to decode parameter. Unexpected JSON object. ",
    category: "temporary",
  },
  "context.failed_to_parse_parameter": {
    description: "Failed to parse parameter. The protocol parameters are not valid JSON. ",
    category: "temporary",
  },
  "context.storage_error": {
    description:
      "Storage error (fatal internal error). An error that should never happen unless something has been deleted or corrupted in the database. ",
    category: "temporary",
  },
  "contract.balance_too_low": {
    description: "Balance too low. An operation tried to spend more tokens than the contract has ",
    category: "temporary",
  },
  "contract.cannot_pay_storage_fee": {
    description: "Cannot pay storage fee. The storage fee is higher than the contract balance ",
    category: "temporary",
  },
  "contract.counter_in_the_future": {
    description:
      "Invalid counter (not yet reached) in a manager operation. An operation assumed a contract counter in the future ",
    category: "temporary",
  },
  "contract.counter_in_the_past": {
    description:
      "Invalid counter (already used) in a manager operation. An operation assumed a contract counter in the past ",
    category: "temporary",
  },
  "contract.empty_transaction": {
    description: "Empty transaction. Forbidden to credit 0ꜩ to a contract without code. ",
    category: "temporary",
  },
  "contract.failure": {
    description: "Contract storage failure. Unexpected contract storage error ",
    category: "temporary",
  },
  "contract.invalid_contract_notation": {
    description:
      "Invalid contract notation. A malformed contract notation was given to an RPC or in a script. ",
    category: "temporary",
  },
  "contract.manager.inconsistent_hash": {
    description:
      "Inconsistent public key hash. A revealed manager public key is inconsistent with the announced hash ",
    category: "temporary",
  },
  "contract.manager.inconsistent_public_key": {
    description:
      "Inconsistent public key. A provided manager public key is different with the public key stored in the contract ",
    category: "temporary",
  },
  "contract.manager.unregistered_delegate": {
    description:
      "Unregistered delegate. A contract cannot be delegated to an unregistered delegate ",
    category: "temporary",
  },
  "contract.missing_manager_contract": {
    description: "Missing manager contract. The manager contract is missing from the storage ",
    category: "temporary",
  },
  "contract.negative_storage_input": {
    description:
      "Negative storage input. The storage amount asked for an operation is null or negative ",
    category: "temporary",
  },
  "contract.non_empty_transaction_from_source": {
    description:
      "Unexpected non-empty transaction. This address cannot initiate non-empty transactions ",
    category: "temporary",
  },
  "contract.non_existing_contract": {
    description:
      "Non existing contract. A contract handle is not present in the context (either it never was or it has been destroyed) ",
    category: "temporary",
  },
  "contract.previously_revealed_key": {
    description:
      "Manager operation already revealed. One tried to reveal twice a manager public key ",
    category: "temporary",
  },
  "contract.unrevealed_key": {
    description:
      "Manager operation precedes key revelation. One tried to apply a manager operation without revealing the manager public key ",
    category: "temporary",
  },
  contract_not_originated: {
    description: "Contract not originated. Non originated contract detected in ticket update. ",
    category: "temporary",
  },
  dal_attestation_size_limit_exceeded: {
    description:
      "DAL attestation exceeded the limit. The attestation for data availability is a too big ",
    category: "temporary",
  },
  dal_cryptobox_error: {
    description: "DAL cryptobox error. Error occurred while initialising the cryptobox ",
    category: "temporary",
  },
  "dal_page_index_repr.index.invalid_index": {
    description:
      "Invalid Dal page index. The given index is out of range of representable page indices ",
    category: "temporary",
  },
  dal_publish_commitment_duplicate: {
    description:
      "DAL publish slot header duplicate. A slot header for this slot was already proposed ",
    category: "temporary",
  },
  dal_publish_commitment_invalid_index: {
    description: "DAL slot header invalid index. Bad index for slot header ",
    category: "temporary",
  },
  dal_publish_commitment_invalid_proof: {
    description:
      "DAL publish slot header invalid proof. The slot header's commitment proof does not check ",
    category: "temporary",
  },
  dal_publish_commitment_with_low_fees: {
    description: "DAL slot header with low fees. Slot header with too low fees ",
    category: "temporary",
  },
  dal_register_invalid_slot: {
    description:
      "Dal register invalid slot. Attempt to register a slot which is invalid (the index is out of bounds). ",
    category: "temporary",
  },
  dal_slot_index_negative_orabove_hard_limit: {
    description: "DAL slot index negative or above hard limit. Slot index above hard limit ",
    category: "temporary",
  },
  "dal_slot_index_repr.index.invalid_index": {
    description:
      "Invalid Dal slot index. The given index is out of range of representable slot indices ",
    category: "temporary",
  },
  "dal_slot_repr.shard_with_proof.dal_shard_proof_error": {
    description: "DAL shard proof error. An error occurred while validating the DAL shard proof. ",
    category: "temporary",
  },
  "dal_slot_repr.shard_with_proof.share_is_trap_error": {
    description:
      "encoding error in Dal.share_is_trap. An encoding error occurred while checking whether a shard is a trap. ",
    category: "temporary",
  },
  "dal_slot_repr.slots_history.dal_proof_error": {
    description:
      "DAL page proof error. Error occurred during DAL page proof production or validation ",
    category: "temporary",
  },
  "dal_slot_repr.slots_history.unexpected_page_size": {
    description:
      "Unexpected page size. The size of the given page content doesn't match the expected one. ",
    category: "temporary",
  },
  "delegate.already_active": {
    description: "Delegate already active. Useless delegate reactivation ",
    category: "temporary",
  },
  "delegate.consensus_key.active": {
    description:
      "Active consensus key. The delegate consensus key is already used by another delegate ",
    category: "temporary",
  },
  "delegate.consensus_key.invalid_noop": {
    description:
      "Invalid key for consensus key update. Tried to update the consensus key with the active key ",
    category: "temporary",
  },
  "delegate.consensus_key.tz4": {
    description: "Consensus key cannot be a tz4. Consensus key cannot be a tz4 (BLS public key). ",
    category: "temporary",
  },
  "delegate.empty_delegate_account": {
    description:
      "Empty delegate account. Cannot register a delegate when its implicit account is empty ",
    category: "temporary",
  },
  "delegate.forbidden_tz4": {
    description: "Forbidden delegate. Delegates are forbidden to be tz4 (BLS) accounts. ",
    category: "temporary",
  },
  "delegate.no_deletion": {
    description: "Forbidden delegate deletion. Tried to unregister a delegate ",
    category: "temporary",
  },
  "delegate.not_registered": {
    description:
      "Not a registered delegate. The provided public key hash is not the address of a registered delegate. ",
    category: "temporary",
  },
  "delegate.stake_distribution_not_set": {
    description:
      "Stake distribution not set. The stake distribution for the current cycle is not set. ",
    category: "temporary",
  },
  "delegate.unchanged": {
    description: "Unchanged delegated. Contract already delegated to the given delegate ",
    category: "temporary",
  },
  "delegate_service.balance_rpc_on_non_delegate": {
    description:
      "Balance request for an unregistered delegate. The account whose balance was requested is not a delegate. ",
    category: "temporary",
  },
  "destination_repr.invalid_b58check": {
    description:
      "Destination decoding failed. Failed to read a valid destination from a b58check_encoding data ",
    category: "temporary",
  },
  "durations.non_increasing_rounds": {
    description: "Non increasing round. The provided rounds are not increasing. ",
    category: "temporary",
  },
  "env.bitfield_invalid_position": {
    description: "Invalid bitfield’s position. Bitfields do not accept negative positions ",
    category: "temporary",
  },
  failure: {
    description: "Exception. Exception safely wrapped in an error ",
    category: "temporary",
  },
  "frozen_bonds.must_be_spent_at_once": {
    description: "Partial spending of frozen bonds. Frozen bonds must be spent at once. ",
    category: "temporary",
  },
  "gas_exhausted.block": {
    description:
      "Gas quota exceeded for the block. The sum of gas consumed by all the operations in the block exceeds the hard gas limit per block ",
    category: "temporary",
  },
  "gas_exhausted.operation": {
    description:
      "Gas quota exceeded for the operation. A script or one of its callee took more time than the operation said it would ",
    category: "temporary",
  },
  gas_limit_too_high: {
    description:
      "Gas limit out of protocol hard bounds. A transaction tried to exceed the hard limit on gas ",
    category: "temporary",
  },
  illformedViewType: {
    description:
      "An entrypoint type is incompatible with TZIP-4 view type. An entrypoint type is incompatible with TZIP-4 view type. ",
    category: "temporary",
  },
  "implicit.empty_implicit_contract": {
    description:
      "Empty implicit contract. No manager operations are allowed on an empty implicit contract. This account has zero balance. Fund it before using. ",
    category: "temporary",
  },
  "implicit.empty_implicit_delegated_contract": {
    description:
      "Empty implicit delegated contract. Emptying an implicit delegated account is not allowed. ",
    category: "temporary",
  },
  "indexable.index_cannot_be_negative": {
    description:
      "Index of values cannot be negative. A negative integer cannot be used as an index for a value. ",
    category: "temporary",
  },
  "internal.smart_rollup_add_zero_messages": {
    description:
      "Internal error: trying to add zero messages. Message adding functions must be called with a positive number of messages ",
    category: "temporary",
  },
  "internal.smart_rollup_inbox_proof_error": {
    description:
      "Internal error: error occurred during proof production or validation. An inbox proof error. ",
    category: "temporary",
  },
  "internal.smart_rollup_merklized_payload_hashes_proof": {
    description:
      "Internal error: error occurred during proof production or validation. A merkelized payload hashes proof error. ",
    category: "temporary",
  },
  internal_operation_replay: {
    description: "Internal operation replay. An internal operation was emitted twice by a script ",
    category: "temporary",
  },
  invalid_arg: {
    description: "Invalid arg. Negative multiple of periods are not allowed. ",
    category: "temporary",
  },
  invalid_binary_format: {
    description:
      "Invalid binary format. Could not deserialize some piece of data from its binary representation ",
    category: "temporary",
  },
  invalid_fitness: {
    description: "Invalid fitness. Fitness representation should be exactly 4 times 4 bytes long. ",
    category: "temporary",
  },
  invalid_ticket_transfer: {
    description:
      "Invalid ticket transfer. Invalid ticket transfer detected in ticket balance update. ",
    category: "temporary",
  },
  level_not_in_alpha: {
    description: "Level not in Alpha family. Level not in Alpha family ",
    category: "temporary",
  },
  level_offset_too_high: {
    description: "level offset too high. The block's level offset is too high. ",
    category: "temporary",
  },
  "level_repr.invalid_cycle_eras": {
    description:
      "Invalid cycle eras. The cycles eras are not valid: empty list or non-decreasing first levels or first cycles. ",
    category: "temporary",
  },
  locked_round_not_less_than_round: {
    description:
      "Locked round not smaller than round. The round is smaller than or equal to the locked round. ",
    category: "temporary",
  },
  "main.begin_application.cannot_apply_in_partial_validation": {
    description:
      "cannot_apply_in_partial_validation. Cannot instantiate an application state using the 'Partial_validation' mode. ",
    category: "temporary",
  },
  malformed_period: {
    description: "Malformed period. Period is negative. ",
    category: "temporary",
  },
  "michelson_v1.bad_contract_parameter": {
    description:
      "Contract supplied an invalid parameter. Either no parameter was supplied to a contract with a non-unit parameter type, a non-unit parameter was passed to an account, or a parameter was supplied of the wrong type ",
    category: "temporary",
  },
  "michelson_v1.bad_dupn_argument": {
    description: "0 passed to DUP n. DUP expects an argument of at least 1 (passed 0) ",
    category: "temporary",
  },
  "michelson_v1.bad_dupn_stack": {
    description:
      "Stack too short when typing DUP n. Stack present when typing DUP n was too short ",
    category: "temporary",
  },
  "michelson_v1.bad_pair_argument": {
    description: "0 or 1 passed to PAIR. PAIR expects an argument of at least 2 ",
    category: "temporary",
  },
  "michelson_v1.bad_return": {
    description: "Bad return. Unexpected stack at the end of a lambda or script. ",
    category: "temporary",
  },
  "michelson_v1.bad_stack": {
    description: "Bad stack. The stack has an unexpected length or contents. ",
    category: "temporary",
  },
  "michelson_v1.bad_stack_item": {
    description:
      "Bad stack item. The type of a stack item is unexpected (this error is always accompanied by a more precise one). ",
    category: "temporary",
  },
  "michelson_v1.bad_unpair_argument": {
    description: "0 or 1 passed to UNPAIR. UNPAIR expects an argument of at least 2 ",
    category: "temporary",
  },
  "michelson_v1.bad_view_name": {
    description: "Bad view name. In a view declaration, the view name must be a string ",
    category: "temporary",
  },
  "michelson_v1.cannot_serialize_failure": {
    description:
      "Not enough gas to serialize argument of FAILWITH. Argument of FAILWITH was too big to be serialized with the provided gas ",
    category: "temporary",
  },
  "michelson_v1.cannot_serialize_log": {
    description:
      "Not enough gas to serialize execution trace. Execution trace with stacks was to big to be serialized with the provided gas ",
    category: "temporary",
  },
  "michelson_v1.cannot_serialize_storage": {
    description:
      "Not enough gas to serialize execution storage. The returned storage was too big to be serialized with the provided gas ",
    category: "temporary",
  },
  "michelson_v1.comparable_type_expected": {
    description:
      "Comparable type expected. A non comparable type was used in a place where only comparable types are accepted. ",
    category: "temporary",
  },
  "michelson_v1.deprecated_instruction": {
    description:
      "Script is using a deprecated instruction. A deprecated instruction usage is disallowed in newly created contracts ",
    category: "temporary",
  },
  "michelson_v1.duplicate_entrypoint": {
    description: "Duplicate entrypoint (type error). Two entrypoints have the same name. ",
    category: "temporary",
  },
  "michelson_v1.duplicate_map_keys": {
    description: "Duplicate map keys. Map literals cannot contain duplicated keys ",
    category: "temporary",
  },
  "michelson_v1.duplicate_script_field": {
    description:
      "Script has a duplicated field (parse error). When parsing script, a field was found more than once ",
    category: "temporary",
  },
  "michelson_v1.duplicate_set_values_in_literal": {
    description:
      "Sets literals cannot contain duplicate elements. Set literals cannot contain duplicate elements, but a duplicate was found while parsing. ",
    category: "temporary",
  },
  "michelson_v1.duplicated_view_name": {
    description: "Duplicated view name. The name of view in toplevel should be unique. ",
    category: "temporary",
  },
  "michelson_v1.entrypoint_name_too_long": {
    description:
      "Entrypoint name too long (type error). An entrypoint name exceeds the maximum length of 31 characters. ",
    category: "temporary",
  },
  "michelson_v1.fail_not_in_tail_position": {
    description:
      "FAIL not in tail position. There is non trivial garbage code after a FAIL instruction. ",
    category: "temporary",
  },
  "michelson_v1.forbidden_instr_in_context": {
    description:
      "Forbidden instruction in context. An instruction was encountered in a context where it is forbidden. ",
    category: "temporary",
  },
  "michelson_v1.forbidden_zero_amount_ticket": {
    description:
      "Zero ticket amount is not allowed. It is not allowed to use a zero amount ticket in this operation. ",
    category: "temporary",
  },
  "michelson_v1.ill_formed_type": {
    description:
      "Ill formed type. The toplevel error thrown when trying to parse a type expression (always followed by more precise errors). ",
    category: "temporary",
  },
  "michelson_v1.ill_typed_contract": {
    description:
      "Ill typed contract. The toplevel error thrown when trying to typecheck a contract code against given input, output and storage types (always followed by more precise errors). ",
    category: "temporary",
  },
  "michelson_v1.ill_typed_data": {
    description:
      "Ill typed data. The toplevel error thrown when trying to typecheck a data expression against a given type (always followed by more precise errors). ",
    category: "temporary",
  },
  "michelson_v1.ill_typed_view": {
    description: "Ill typed view. The return of a view block did not match the expected type ",
    category: "temporary",
  },
  "michelson_v1.inconsistent_memo_sizes": {
    description:
      "Inconsistent memo sizes. Memo sizes of two sapling states or transactions do not match ",
    category: "temporary",
  },
  "michelson_v1.inconsistent_stack_lengths": {
    description:
      "Inconsistent stack lengths. A stack was of an unexpected length (this error is always in the context of a located error). ",
    category: "temporary",
  },
  "michelson_v1.inconsistent_type_sizes": {
    description:
      "Inconsistent type sizes. Two types were expected to be equal but they have different sizes. ",
    category: "temporary",
  },
  "michelson_v1.inconsistent_types": {
    description:
      "Inconsistent types. This is the basic type clash error, that appears in several places where the equality of two types have to be proven, it is always accompanied with another error that provides more context. ",
    category: "temporary",
  },
  "michelson_v1.invalid_arity": {
    description:
      "Invalid arity. In a script or data expression, a primitive was applied to an unsupported number of arguments. ",
    category: "temporary",
  },
  "michelson_v1.invalid_big_map": {
    description:
      "Invalid big_map. A script or data expression references a big_map that does not exist or assumes a wrong type for an existing big_map. ",
    category: "temporary",
  },
  "michelson_v1.invalid_constant": {
    description: "Invalid constant. A data expression was invalid for its expected type. ",
    category: "temporary",
  },
  "michelson_v1.invalid_contract": {
    description:
      "Invalid contract. A script or data expression references a contract that does not exist or assumes a wrong type for an existing contract. ",
    category: "temporary",
  },
  "michelson_v1.invalid_expression_kind": {
    description:
      "Invalid expression kind. In a script or data expression, an expression was of the wrong kind (for instance a string where only a primitive applications can appear). ",
    category: "temporary",
  },
  "michelson_v1.invalid_iter_body": {
    description:
      "ITER body returned wrong stack type. The body of an ITER instruction must result in the same stack type as before the ITER. ",
    category: "temporary",
  },
  "michelson_v1.invalid_map_block_fail": {
    description:
      "FAIL instruction occurred as body of map block. FAIL cannot be the only instruction in the body. The proper type of the return list cannot be inferred. ",
    category: "temporary",
  },
  "michelson_v1.invalid_map_body": {
    description: "Invalid map body. The body of a map block did not match the expected type ",
    category: "temporary",
  },
  "michelson_v1.invalid_never_expr": {
    description:
      "Invalid expression for type never. In a script or data expression, an expression was provided but a value of type never was expected. No expression can have type never. ",
    category: "temporary",
  },
  "michelson_v1.invalid_primitive": {
    description: "Invalid primitive. In a script or data expression, a primitive was unknown. ",
    category: "temporary",
  },
  "michelson_v1.invalid_primitive_name": {
    description:
      "Invalid primitive name. In a script or data expression, a primitive name is unknown or has a wrong case. ",
    category: "temporary",
  },
  "michelson_v1.invalid_primitive_name_case": {
    description:
      "Invalid primitive name case. In a script or data expression, a primitive name is neither uppercase, lowercase or capitalized. ",
    category: "temporary",
  },
  "michelson_v1.invalid_primitive_namespace": {
    description:
      "Invalid primitive namespace. In a script or data expression, a primitive was of the wrong namespace. ",
    category: "temporary",
  },
  "michelson_v1.invalid_seq_arity": {
    description:
      "Invalid sequence arity. In a script or data expression, a sequence was used with a number of elements too small. ",
    category: "temporary",
  },
  "michelson_v1.invalid_syntactic_constant": {
    description:
      "Invalid constant (parse error). A compile-time constant was invalid for its expected form. ",
    category: "temporary",
  },
  "michelson_v1.invalid_tx_rollup_ticket_amount": {
    description:
      "Invalid ticket amount. Ticket amount to be deposited in a transaction rollup should be strictly positive and fit in a signed 64-bit integer ",
    category: "temporary",
  },
  "michelson_v1.missing_script_field": {
    description:
      "Script is missing a field (parse error). When parsing script, a field was expected, but not provided ",
    category: "temporary",
  },
  "michelson_v1.no_such_entrypoint": {
    description:
      "No such entrypoint (type error). An entrypoint was not found when calling a contract. ",
    category: "temporary",
  },
  "michelson_v1.non_dupable_type": {
    description:
      "Non-dupable type duplication attempt. DUP was used on a non-dupable type (e.g. tickets). ",
    category: "temporary",
  },
  "michelson_v1.non_printable_character": {
    description:
      "Non printable character in a Michelson string. Michelson strings are only allowed to contain printable characters (either the newline character or characters in the [32, 126] ASCII range). ",
    category: "temporary",
  },
  "michelson_v1.runtime_error": {
    description: "Script runtime error. Toplevel error for all runtime script errors ",
    category: "temporary",
  },
  "michelson_v1.sc_rollup_disabled": {
    description: "Sc rollup are disabled. Cannot use smart rollup features as they are disabled. ",
    category: "temporary",
  },
  "michelson_v1.script_overflow": {
    description:
      "Script failed (overflow error). While interpreting a Michelson script, an overflow was detected ",
    category: "temporary",
  },
  "michelson_v1.script_rejected": {
    description: "Script failed. A FAILWITH instruction was reached ",
    category: "temporary",
  },
  "michelson_v1.tx_rollup_bad_deposit_parameter": {
    description:
      "Bad deposit parameter. The parameter to the deposit entrypoint of a transaction rollup should be a pair of a ticket and the address of a recipient transaction rollup. ",
    category: "temporary",
  },
  "michelson_v1.type_too_large": {
    description:
      "Stack item type too large. An instruction generated a type larger than the limit. ",
    category: "temporary",
  },
  "michelson_v1.typechecking_too_many_recursive_calls": {
    description:
      "Too many recursive calls during typechecking. Too many recursive calls were needed for typechecking ",
    category: "temporary",
  },
  "michelson_v1.undefined_binop": {
    description:
      "Undefined binop. A binary operation is called on operands of types over which it is not defined. ",
    category: "temporary",
  },
  "michelson_v1.undefined_unop": {
    description:
      "Undefined unop. A unary operation is called on an operand of type over which it is not defined. ",
    category: "temporary",
  },
  "michelson_v1.unexpected_annotation": {
    description:
      "An annotation was encountered where no annotation is expected. A node in the syntax tree was improperly annotated ",
    category: "temporary",
  },
  "michelson_v1.unexpected_contract": {
    description:
      "Contract in unauthorized position (type error). When parsing script, a contract type was found in the storage or parameter field. ",
    category: "temporary",
  },
  "michelson_v1.unexpected_default_entrypoint": {
    description:
      "The annotation ‘default’ was encountered where an entrypoint is expected. A node in the syntax tree was improperly annotated. An annotation used to designate an entrypoint cannot be exactly 'default'. ",
    category: "temporary",
  },
  "michelson_v1.unexpected_forged_value": {
    description:
      "Unexpected forged value. A forged value was encountered but disallowed for that position. ",
    category: "temporary",
  },
  "michelson_v1.unexpected_implicit_account_parameters_type": {
    description:
      "Unexpected implicit account parameters type. An implicit account can only accept either a unit or a ticket value as a call parameter. ",
    category: "temporary",
  },
  "michelson_v1.unexpected_lazy_storage": {
    description:
      "Lazy storage in unauthorized position (type error). When parsing script, a big_map or sapling_state type was found in a position where it could end up stored inside a big_map, which is forbidden for now. ",
    category: "temporary",
  },
  "michelson_v1.unexpected_operation": {
    description:
      "Operation in unauthorized position (type error). When parsing script, an operation type was found in the storage or parameter field. ",
    category: "temporary",
  },
  "michelson_v1.unexpected_ticket": {
    description: "Ticket in unauthorized position (type error). A ticket type has been found ",
    category: "temporary",
  },
  "michelson_v1.unexpected_ticket_owner": {
    description: "Unexpected ticket owner. Ticket can only be created by a smart contract ",
    category: "temporary",
  },
  "michelson_v1.ungrouped_annotations": {
    description:
      "Annotations of the same kind were found spread apart. Annotations of the same kind must be grouped ",
    category: "temporary",
  },
  "michelson_v1.unknown_primitive_name": {
    description:
      "Unknown primitive name. In a script or data expression, a primitive was unknown. ",
    category: "temporary",
  },
  "michelson_v1.unmatched_branches": {
    description:
      "Unmatched branches. At the join point at the end of two code branches the stacks have inconsistent lengths or contents. ",
    category: "temporary",
  },
  "michelson_v1.unordered_map_literal": {
    description: "Invalid map key order. Map keys must be in strictly increasing order ",
    category: "temporary",
  },
  "michelson_v1.unordered_set_literal": {
    description: "Invalid set value order. Set values must be in strictly increasing order ",
    category: "temporary",
  },
  "michelson_v1.unparsing_stack_overflow": {
    description:
      "Too many recursive calls during unparsing. Too many recursive calls were needed for unparsing ",
    category: "temporary",
  },
  "michelson_v1.unreachable_entrypoint": {
    description:
      "Unreachable entrypoint (type error). An entrypoint in the contract is not reachable. ",
    category: "temporary",
  },
  "michelson_v1.view_name_too_long": {
    description:
      "View name too long (type error). A view name exceeds the maximum length of 31 characters. ",
    category: "temporary",
  },
  negative_level_and_offset_sum: {
    description: "Negative sum of level and offset. Negative sum of level and offset ",
    category: "temporary",
  },
  negative_level_offset: {
    description: "The specified level offset is negative. The specified level offset is negative ",
    category: "temporary",
  },
  negative_round: {
    description: "Negative round. Round cannot be built out of negative integers. ",
    category: "temporary",
  },
  "nonce.already_revealed": {
    description: "Already revealed nonce. Duplicated revelation for a nonce. ",
    category: "temporary",
  },
  "nonce.inconsistent": {
    description:
      "Inconsistent nonce. The provided nonce is inconsistent with the committed nonce hash. ",
    category: "temporary",
  },
  "nonce.too_early_revelation": {
    description: "Too early nonce revelation. Nonce revelation happens before cycle end ",
    category: "temporary",
  },
  "nonce.too_late_revelation": {
    description: "Too late nonce revelation. Nonce revelation happens too late ",
    category: "temporary",
  },
  "operation.arith_pvm_disabled": {
    description: "The Arith PVM is disabled. Arith PVM is disabled in this network. ",
    category: "temporary",
  },
  "operation.ballot_from_unregistered_delegate": {
    description:
      "Ballot from an unregistered delegate. Cannot cast a ballot for an unregistered delegate. ",
    category: "temporary",
  },
  "operation.cannot_parse": {
    description:
      "Cannot parse operation. The operation is ill-formed or for another protocol version ",
    category: "temporary",
  },
  "operation.cannot_stake_with_unfinalizable_unstake_requests_to_another_delegate": {
    description:
      "Cannot stake with unfinalizable unstake requests to another delegate. A contract tries to stake to its delegate while having unstake requests to a previous delegate that cannot be finalized yet. Try again in a later cycle (no more than consensus_rights_delay + max_slashing_period). ",
    category: "temporary",
  },
  "operation.cannot_unstake_with_unfinalizable_unstake_requests_to_another_delegate": {
    description:
      "Cannot unstake with unfinalizable unstake requests to another delegate. Cannot unstake with unfinalizable unstake requests to another delegate ",
    category: "temporary",
  },
  "operation.contents_list_error": {
    description:
      "Invalid list of operation contents. An operation contents list has an unexpected shape; it should be either a single operation or a non-empty list of manager operations ",
    category: "temporary",
  },
  "operation.dal_disabled": {
    description: "DAL is disabled. Data-availability layer will be enabled in a future proposal. ",
    category: "temporary",
  },
  "operation.dal_incentives_disabled": {
    description: "DAL incentives are disabled. Incentives for the DAL are not yet enabled. ",
    category: "temporary",
  },
  "operation.double_inclusion_of_consensus_operation": {
    description:
      "Double inclusion of consensus operation. double inclusion of consensus operation ",
    category: "temporary",
  },
  "operation.drain_delegate_key_on_unregistered_delegate": {
    description:
      "Drain delegate key on an unregistered delegate. Cannot drain an unregistered delegate. ",
    category: "temporary",
  },
  "operation.error_while_taking_fees": {
    description:
      "Error while taking the fees of a manager operation. There was an error while taking the fees, which should not happen and means that the operation's validation was faulty. ",
    category: "temporary",
  },
  "operation.faulty_validation_wrong_slot": {
    description:
      "Faulty validation (wrong slot for consensus operation). The consensus operation uses an invalid slot. This error should not happen: the operation validation should have failed earlier. ",
    category: "temporary",
  },
  "operation.invalid_drain.inactive_key": {
    description:
      "Drain delegate with an inactive consensus key. Cannot drain with an inactive consensus key. ",
    category: "temporary",
  },
  "operation.invalid_drain.insufficient_funds_for_burn_or_fees": {
    description:
      "Drain delegate without enough balance for allocation burn or drain fees. Cannot drain without enough allocation burn and drain fees. ",
    category: "temporary",
  },
  "operation.invalid_drain.no_consensus_key": {
    description:
      "Drain a delegate without consensus key. Cannot drain a delegate without consensus key. ",
    category: "temporary",
  },
  "operation.invalid_drain.noop": {
    description: "Invalid drain delegate: noop. Cannot drain a delegate to itself. ",
    category: "temporary",
  },
  "operation.invalid_signature": {
    description:
      "Invalid operation signature. The operation signature is ill-formed or has been made with the wrong public key ",
    category: "temporary",
  },
  "operation.missing_signature": {
    description:
      "Missing operation signature. The operation is of a kind that must be signed, but the signature is missing ",
    category: "temporary",
  },
  "operation.proposals_from_unregistered_delegate": {
    description:
      "Proposals from an unregistered delegate. Cannot submit proposals with an unregistered delegate. ",
    category: "temporary",
  },
  "operation.riscv_pvm_disabled": {
    description: "The RISCV PVM is disabled. RISCV PVM is disabled in this network. ",
    category: "temporary",
  },
  "operation.rollup_invalid_entrypoint": {
    description:
      "Only the default entrypoint is allowed for rollups. Rollups only support transactions to the default entrypoint. ",
    category: "temporary",
  },
  "operation.rollup_invalid_transaction_amount": {
    description:
      "Transaction amount to a rollup must be zero. Because rollups are outside of the delegation mechanism of Tezos, they cannot own Tez, and therefore transactions targeting a rollup must have its amount field set to zero. ",
    category: "temporary",
  },
  "operation.set_deposits_limit_on_unregistered_delegate": {
    description:
      "Set deposits limit on an unregistered delegate. Cannot set deposits limit on an unregistered delegate. ",
    category: "temporary",
  },
  "operation.set_deposits_limit_when_automated_staking_off": {
    description:
      "Set deposits limit when automated staking off. Cannot set deposits limit when automated staking is off or Adaptive Issuance is active. ",
    category: "temporary",
  },
  "operation.update_consensus_key_on_unregistered_delegate": {
    description:
      "Update consensus key on an unregistered delegate. Cannot update consensus key an unregistered delegate. ",
    category: "temporary",
  },
  "operation.zk_rollup_deposit_as_external": {
    description:
      "attempted a deposit through an external op. Zk_rollup: attempted a deposit through an external op ",
    category: "temporary",
  },
  "operation.zk_rollup_disabled": {
    description: "ZK rollups are disabled. ZK rollups will be enabled in a future proposal. ",
    category: "temporary",
  },
  "operation.zk_rollup_failed_verification": {
    description: "failed verification. Zk_rollup_update: failed verification ",
    category: "temporary",
  },
  "operation.zk_rollup_inconsistent_state_update": {
    description: "inconsistent state update. Zk_rollup_update: new state is of incorrect size ",
    category: "temporary",
  },
  "operation.zk_rollup_invalid_circuit": {
    description: "invalid circuit. Zk_rollup_update: invalid circuit ",
    category: "temporary",
  },
  "operation.zk_rollup_invalid_deposit_amount": {
    description:
      "attempted a deposit with an invalid amount. Zk_rollup: attempted a deposit with an invalid amount ",
    category: "temporary",
  },
  "operation.zk_rollup_invalid_deposit_ticket": {
    description:
      "attempted a deposit with an invalid ticket. Zk_rollup: attempted a deposit with an invalid ticket ",
    category: "temporary",
  },
  "operation.zk_rollup_negative_nb_ops": {
    description:
      "ZK rollups negative number of operations. The value of [nb_ops] should never be negative. ",
    category: "temporary",
  },
  "operation.zk_rollup_pending_bound": {
    description:
      "update with fewer pending ops than allowed. Zk_rollup_update: update with fewer pending ops than allowed ",
    category: "temporary",
  },
  "operation.zk_rollup_wrong_deposit_parameters": {
    description:
      "attempted a deposit with invalid parameters. Zk_rollup: attempted a deposit with invalid parameters ",
    category: "temporary",
  },
  "operations.cannot_stake_on_fully_slashed_delegate": {
    description:
      "Cannot stake on fully slashed delegate. The delegate has been fully slashed, so its external stakers can no longer stake. This restriction is permanent. If they wish to be able to stake again, the stakers must change delegates. ",
    category: "temporary",
  },
  "operations.invalid_nonzero_transaction_amount": {
    description:
      "Invalid non-zero transaction amount. A transaction expected a zero-amount but got non-zero. ",
    category: "temporary",
  },
  "operations.invalid_self_transaction_destination": {
    description:
      "Invalid destination for a pseudo-transaction. A pseudo-transaction destination must equal its sender. ",
    category: "temporary",
  },
  "operations.invalid_sender": {
    description:
      "Invalid sender for an internal operation. Invalid sender for an internal operation restricted to implicit and originated accounts. ",
    category: "temporary",
  },
  "operations.invalid_staking_parameters": {
    description: "Invalid parameters for staking parameters. The staking parameters are invalid. ",
    category: "temporary",
  },
  "operations.invalid_staking_parameters_sender": {
    description:
      "Invalid staking parameters sender. The staking parameters can only be set by delegates. ",
    category: "temporary",
  },
  "operations.invalid_transfer_to_smart_rollup_from_implicit_account": {
    description:
      "Invalid transfer to smart rollup. Invalid transfer to smart rollup from implicit account ",
    category: "temporary",
  },
  "operations.stake_modification_with_no_delegate_set": {
    description:
      "(Un)staking without any delegate set. (Un)Stake operations are only allowed when delegate is set. ",
    category: "temporary",
  },
  "operations.staking_for_delegator_while_external_staking_disabled": {
    description:
      "Staking for a delegator while external staking is disabled. As long as external staking is not enabled, staking operations are only allowed from delegates. ",
    category: "temporary",
  },
  "operations.staking_to_delegate_that_refuses_external_staking": {
    description:
      "Staking to delegate that does not accept external staking. The delegate currently does not accept staking operations from sources other than itself: its `limit_of_staking_over_baking` parameter is set to 0. ",
    category: "temporary",
  },
  out_of_bound_issuance_bonus: {
    description: "Out of bound issuance bonus. Computed issuance bonus is out of bound ",
    category: "temporary",
  },
  outdated_fitness: {
    description: "Outdated fitness. Outdated fitness: referring to a previous version ",
    category: "temporary",
  },
  period_overflow: {
    description: "Period overflow. Last operation generated an integer overflow. ",
    category: "temporary",
  },
  "prefilter.Consensus_operation_in_far_future": {
    description:
      "Consensus operation in far future. Consensus operation too far in the future are not accepted. ",
    category: "temporary",
  },
  "prefilter.fees_too_low": {
    description: "Operation fees are too low. Operation fees are too low ",
    category: "temporary",
  },
  "prefilter.wrong_operation": {
    description: "Wrong operation. Failing_noop operations are not accepted in the mempool. ",
    category: "temporary",
  },
  published_slot_headers_not_initialized: {
    description:
      "The published slot headers bucket not initialized in the context. The published slot headers bucket is not initialized in the context ",
    category: "temporary",
  },
  "raw_context.consensus.slot_map_not_found": {
    description: "Slot map not found. Pre-computed map by first slot not found. ",
    category: "temporary",
  },
  "rollup.error_zk_rollup_address_generation": {
    description: "Error while generating rollup address. Error while generating rollup address ",
    category: "temporary",
  },
  round_of_past_timestamp: {
    description:
      "Round_of_timestamp for past timestamp. Provided timestamp is before the expected level start. ",
    category: "temporary",
  },
  round_overflow: {
    description:
      "Round overflow. Round cannot be built out of integer greater than maximum int32 value. ",
    category: "temporary",
  },
  round_too_high: { description: "round too high. block round too high. ", category: "temporary" },
  run_operation_does_not_support_consensus_operations: {
    description:
      "Run operation does not support consensus operations. The run_operation RPC does not support consensus operations. ",
    category: "temporary",
  },
  sampler_already_set: {
    description:
      "Sampler already set. Internal error: Raw_context.set_sampler_for_cycle was called twice for a given cycle ",
    category: "temporary",
  },
  "seed.unknown_seed": {
    description: "Unknown seed. The requested seed is not available ",
    category: "temporary",
  },
  "slot.invalid_slot": { description: "invalid slot. Invalid slot ", category: "temporary" },
  smart_rollup_add_zero_messages: {
    description:
      "Tried to add zero messages to a smart rollup. Tried to add zero messages to a smart rollup ",
    category: "temporary",
  },
  smart_rollup_address_generation: {
    description:
      "Error while generating a smart rollup address. Error while generating a smart rollup address ",
    category: "temporary",
  },
  smart_rollup_arith_invalid_claim_about_outbox: {
    description: "Invalid claim about outbox. Invalid claim about outbox ",
    category: "temporary",
  },
  smart_rollup_arith_output_proof_production_failed: {
    description: "Output proof production failed. Output proof production failed ",
    category: "temporary",
  },
  smart_rollup_arith_proof_production_failed: {
    description: "Proof production failed. Proof production failed ",
    category: "temporary",
  },
  smart_rollup_bad_commitment_serialization: {
    description: "Could not serialize commitment. Unable to hash the commitment serialization. ",
    category: "temporary",
  },
  smart_rollup_bad_inbox_level: {
    description: "Committing to a bad inbox level. Attempted to commit to a bad inbox level. ",
    category: "temporary",
  },
  smart_rollup_commitment_disputed: {
    description: "Commitment disputed. Attempted to cement a disputed commitment. ",
    category: "temporary",
  },
  smart_rollup_commitment_from_future: {
    description:
      "Commitment from future. Commitment inbox level is greater or equal than current level ",
    category: "temporary",
  },
  smart_rollup_commitment_past_curfew: {
    description:
      "Commitment past curfew. A commitment exists for this inbox level for longer than the curfew period. ",
    category: "temporary",
  },
  smart_rollup_commitment_too_old: {
    description: "Published commitment is too old. Published commitment is too old ",
    category: "temporary",
  },
  smart_rollup_commitment_too_recent: {
    description:
      "Commitment too recent. Attempted to cement a commitment before its refutation deadline. ",
    category: "temporary",
  },
  smart_rollup_dissection_edge_ticks_mismatch: {
    description:
      "Mismatch in the edge ticks of the dissection. Mismatch in the edge ticks of the dissection ",
    category: "temporary",
  },
  smart_rollup_dissection_invalid_distribution: {
    description:
      "Ticks should only increase in dissection. Ticks should only increase in dissection ",
    category: "temporary",
  },
  smart_rollup_dissection_invalid_number_of_sections: {
    description:
      "Invalid number of sections in the dissection. Invalid number of sections in the dissection ",
    category: "temporary",
  },
  smart_rollup_dissection_invalid_successive_states_shape: {
    description:
      "Cannot recover from a blocked state in a dissection. Cannot recover from a blocked state in a dissection ",
    category: "temporary",
  },
  smart_rollup_dissection_number_of_sections_mismatch: {
    description:
      "Mismatch in the number of sections in the dissection. Mismatch in the number of sections in the dissection ",
    category: "temporary",
  },
  smart_rollup_dissection_start_hash_mismatch: {
    description:
      "Mismatch in the start hash of the dissection. Mismatch in the start hash of the dissection ",
    category: "temporary",
  },
  smart_rollup_dissection_stop_hash_mismatch: {
    description:
      "Mismatch in the stop hash of the dissection. Mismatch in the stop hash of the dissection ",
    category: "temporary",
  },
  smart_rollup_dissection_ticks_not_increasing: {
    description:
      "Ticks should only increase in dissection. Ticks should only increase in dissection ",
    category: "temporary",
  },
  smart_rollup_does_not_exist: {
    description:
      "Smart rollup does not exist. Attempted to use a smart rollup that has not been originated. ",
    category: "temporary",
  },
  smart_rollup_double_publish: {
    description: "The commitment was published twice by the operator. No commitment to cement ",
    category: "temporary",
  },
  smart_rollup_duplicated_key_in_whitelist: {
    description: "No commitment to cement. No commitment to cement ",
    category: "temporary",
  },
  smart_rollup_empty_whitelist: {
    description:
      "Invalid whitelist: whitelist cannot be empty. Smart rollup whitelist cannot be empty ",
    category: "temporary",
  },
  smart_rollup_game_already_started: {
    description:
      "Refutation game already started. Refutation game already started, must play with is_opening_move = false. ",
    category: "temporary",
  },
  smart_rollup_inbox_level_reached_message_limit: {
    description:
      "Inbox level reached messages limit. There can be only 1000000 messages in an inbox level, the limit has been reached. ",
    category: "temporary",
  },
  smart_rollup_inbox_message_decoding: {
    description:
      "Failed to decode a smart rollup management protocol inbox message value. Failed to decode a smart rollup management protocol inbox message value ",
    category: "temporary",
  },
  smart_rollup_inbox_message_encoding: {
    description:
      "Failed to encode a rollup management protocol inbox message value. Failed to encode a rollup management protocol inbox message value ",
    category: "temporary",
  },
  smart_rollup_invalid_last_cemented_commitment: {
    description: "Invalid last-cemented-commitment. Invalid last-cemented-commitment ",
    category: "temporary",
  },
  smart_rollup_invalid_outbox_level: {
    description: "Invalid outbox level. Invalid outbox level ",
    category: "temporary",
  },
  smart_rollup_invalid_outbox_message_index: {
    description: "Invalid rollup outbox message index. Invalid rollup outbox message index ",
    category: "temporary",
  },
  smart_rollup_invalid_output_proof: {
    description: "Invalid output proof. Invalid output proof ",
    category: "temporary",
  },
  smart_rollup_invalid_parameters_type: {
    description: "Invalid parameters type. Invalid parameters type for smart rollup ",
    category: "temporary",
  },
  smart_rollup_invalid_serialized_inbox_proof: {
    description:
      "Invalid serialized inbox proof. The serialized inbox proof can not be de-serialized ",
    category: "temporary",
  },
  smart_rollup_management_protocol_invalid_destination: {
    description: "Invalid destination. Invalid destination ",
    category: "temporary",
  },
  smart_rollup_max_number_of_messages_reached_for_commitment_period: {
    description:
      "Maximum number of messages reached for commitment period. Maximum number of messages reached for commitment period ",
    category: "temporary",
  },
  smart_rollup_maximal_number_of_parallel_games_reached: {
    description:
      "Maximal number of parallel games reached. Maximal number of parallel games reached ",
    category: "temporary",
  },
  smart_rollup_no_commitment_to_cement: {
    description: "No commitment to cement. No commitment to cement ",
    category: "temporary",
  },
  smart_rollup_no_conflict: { description: "No conflict. No conflict. ", category: "temporary" },
  smart_rollup_no_game: {
    description: "Refutation game does not exist. Refutation game does not exist ",
    category: "temporary",
  },
  smart_rollup_no_stakers: {
    description: "No stakers. No stakers for the targeted smart rollup. ",
    category: "temporary",
  },
  smart_rollup_no_valid_commitment_to_cement: {
    description:
      "No valid commitment to cement. Attempted to cement a commitment but there is no valid commitment to cement. ",
    category: "temporary",
  },
  smart_rollup_not_staked: {
    description: "Unknown staker. This implicit account is not a staker of this smart rollup. ",
    category: "temporary",
  },
  smart_rollup_not_staked_on_lcc_or_ancestor: {
    description:
      "Smart rollup not staked on LCC or its ancestor. Attempted to withdraw while not staked on the last cemented commitment or its ancestor. ",
    category: "temporary",
  },
  smart_rollup_not_valid_commitments_conflict: {
    description:
      "Conflicting commitments do not have a common ancestor. Conflicting commitments do not have a common ancestor ",
    category: "temporary",
  },
  smart_rollup_outbox_level_expired: {
    description: "Outbox level expired. Outbox level expired ",
    category: "temporary",
  },
  smart_rollup_outbox_message_already_applied: {
    description: "Outbox message already applied. Outbox message already applied ",
    category: "temporary",
  },
  "smart_rollup_outbox_message_repr.error_decoding_outbox_message": {
    description:
      "Failed to decode a rollup management protocol outbox message value. Failed to decode a rollup management protocol outbox message value ",
    category: "temporary",
  },
  "smart_rollup_outbox_message_repr.error_encoding_outbox_message": {
    description:
      "Failed to encode a rollup management protocol outbox message value. Failed to encode a rollup management protocol outbox message value ",
    category: "temporary",
  },
  smart_rollup_outdated_whitelist_update: {
    description: "Outdated whitelist update. Outdated whitelist update ",
    category: "temporary",
  },
  smart_rollup_parent_not_lcc: {
    description:
      "Parent is not the last cemented commitment. Parent is not the last cemented commitment. ",
    category: "temporary",
  },
  smart_rollup_proof_check: {
    description: "Invalid proof. An invalid proof has been submitted ",
    category: "temporary",
  },
  smart_rollup_remove_lcc_or_ancestor: {
    description: "Can not remove a staker. Can not remove a staker committed on cemented. ",
    category: "temporary",
  },
  smart_rollup_riscv_output_proof_verification_failed: {
    description: "Output proof verification failed. Output proof verification failed ",
    category: "temporary",
  },
  smart_rollup_riscv_proof_production_failed: {
    description: "Proof production failed. Proof production failed ",
    category: "temporary",
  },
  smart_rollup_riscv_proof_verification_failed: {
    description: "Proof verification failed. Proof verification failed ",
    category: "temporary",
  },
  smart_rollup_rollup_is_public: {
    description: "No commitment to cement. No commitment to cement ",
    category: "temporary",
  },
  smart_rollup_staker_double_stake: {
    description: "Staker tried to double stake. Staker tried to double stake. ",
    category: "temporary",
  },
  smart_rollup_staker_funds_too_low: {
    description:
      "Staker does not have enough funds to make a deposit. Staker doesn't have enough funds to make a smart rollup deposit. ",
    category: "temporary",
  },
  smart_rollup_staker_in_game: {
    description:
      "Staker is already playing a game. Attempted to start a game where one staker is already busy ",
    category: "temporary",
  },
  smart_rollup_staker_not_in_whitelist: {
    description: "No commitment to cement. No commitment to cement ",
    category: "temporary",
  },
  smart_rollup_timeout_level_not_reached: {
    description: "Attempt to timeout game too early. Attempt to timeout game too early ",
    category: "temporary",
  },
  smart_rollup_too_far_ahead: {
    description:
      "Commitment too far ahead. Commitment is too far ahead of the last cemented commitment. ",
    category: "temporary",
  },
  smart_rollup_unknown_commitment: {
    description: "Unknown commitment. Unknown commitment. ",
    category: "temporary",
  },
  smart_rollup_wasm_invalid_claim_about_outbox: {
    description: "Invalid claim about outbox. Invalid claim about outbox ",
    category: "temporary",
  },
  smart_rollup_wasm_invalid_dissection_distribution: {
    description:
      "Invalid dissection distribution: not all ticks are a multiplier of the maximum number of ticks of a snapshot. Invalid dissection distribution: not all ticks are a multiplier of the maximum number of ticks of a snapshot ",
    category: "temporary",
  },
  smart_rollup_wasm_output_proof_production_failed: {
    description: "Output proof production failed. Output proof production failed ",
    category: "temporary",
  },
  smart_rollup_wasm_output_proof_verification_failed: {
    description: "Output proof verification failed. Output proof verification failed ",
    category: "temporary",
  },
  smart_rollup_wasm_proof_production_failed: {
    description: "Proof production failed. Proof production failed ",
    category: "temporary",
  },
  smart_rollup_wasm_proof_verification_failed: {
    description: "Proof verification failed. Proof verification failed ",
    category: "temporary",
  },
  smart_rollup_whitelist_disabled: {
    description:
      "Invalid whitelist: must be None when the feature is deactivated. The whitelist must be None when the feature is deactivated. ",
    category: "temporary",
  },
  smart_rollup_wrong_staker_for_conflict_commitment: {
    description:
      "Given commitment is not staked by given staker. Given commitment is not staked by given staker ",
    category: "temporary",
  },
  smart_rollup_wrong_turn: {
    description:
      "Attempt to play move but not staker’s turn. Attempt to play move but not staker's turn ",
    category: "temporary",
  },
  smart_rollup_zero_tick_commitment: {
    description: "Tried to publish a 0 tick commitment. Tried to publish a 0 tick commitment ",
    category: "temporary",
  },
  "storage_exhausted.operation": {
    description:
      "Storage quota exceeded for the operation. A script or one of its callee wrote more bytes than the operation said it would ",
    category: "temporary",
  },
  storage_limit_too_high: {
    description:
      "Storage limit out of protocol hard bounds. A transaction tried to exceed the hard limit on storage ",
    category: "temporary",
  },
  "tez.addition_overflow": {
    description: "Overflowing tez addition. An addition of two tez amounts overflowed ",
    category: "temporary",
  },
  "tez.invalid_divisor": {
    description: "Invalid tez divisor. Multiplication of a tez amount by a non positive integer ",
    category: "temporary",
  },
  "tez.multiplication_overflow": {
    description:
      "Overflowing tez multiplication. A multiplication of a tez amount by an integer overflowed ",
    category: "temporary",
  },
  "tez.negative_multiplicator": {
    description:
      "Negative tez multiplicator. Multiplication of a tez amount by a negative integer ",
    category: "temporary",
  },
  "tez.subtraction_underflow": {
    description:
      "Underflowing tez subtraction. A subtraction of two tez amounts underflowed (i.e., would have led to a negative amount) ",
    category: "temporary",
  },
  timestamp_add: {
    description: "Timestamp add. Overflow when adding timestamps. ",
    category: "temporary",
  },
  timestamp_sub: {
    description: "Timestamp sub. Subtracting timestamps resulted in negative period. ",
    category: "temporary",
  },
  too_many_internal_operations: {
    description:
      "Too many internal operations. A transaction exceeded the hard limit of internal operations it can emit ",
    category: "temporary",
  },
  undefined_operation_nonce: {
    description:
      "Ill timed access to the origination nonce. An origination was attempted out of the scope of a manager operation ",
    category: "temporary",
  },
  undetermined_issuance_coeff_for_cycle: {
    description:
      "Undetermined issuance coeff for cycle. Issuance coefficient is only determined for the current cycle and the next [consensus_rights_delay] cycles to come. Requested cycle is not in this window. ",
    category: "temporary",
  },
  unexpected_level: {
    description: "Unexpected level. Level must be non-negative. ",
    category: "temporary",
  },
  unexpected_nonce_length: {
    description: "Unexpected nonce length. Nonce length is incorrect. ",
    category: "temporary",
  },
  "validate.block.inconsistent_validation_passes_in_block": {
    description:
      "Inconsistent validation passes in block. Validation of operation should be ordered by their validation passes in a block. ",
    category: "temporary",
  },
  "validate.block.insufficient_locked_round_evidence": {
    description: "Insufficient locked round evidence. Insufficient locked round evidence. ",
    category: "temporary",
  },
  "validate.block.invalid_double_baking_evidence": {
    description:
      "Invalid double baking evidence. A double-baking evidence is inconsistent (two distinct levels) ",
    category: "temporary",
  },
  "validate.block.invalid_payload_hash": {
    description: "Invalid payload hash. Invalid payload hash. ",
    category: "temporary",
  },
  "validate.block.locked_round_after_block_round": {
    description: "Locked round after block round. Locked round after block round. ",
    category: "temporary",
  },
  "validate.block.not_enough_attestations": {
    description:
      "Not enough attestations. The block being validated does not include the required minimum number of attestations. ",
    category: "temporary",
  },
  "validate.consensus_operation_for_future_level": {
    description: "Consensus operation for future level. Consensus operation for future level. ",
    category: "temporary",
  },
  "validate.consensus_operation_for_future_round": {
    description: "Consensus operation for future round. Consensus operation for future round. ",
    category: "temporary",
  },
  "validate.consensus_operation_for_old_level": {
    description: "Consensus operation for old level. Consensus operation for old level. ",
    category: "temporary",
  },
  "validate.consensus_operation_for_old_round": {
    description: "Consensus operation for old round. Consensus operation for old round. ",
    category: "temporary",
  },
  "validate.consensus_operation_not_allowed": {
    description: "Consensus operation not allowed. Consensus operation not allowed. ",
    category: "temporary",
  },
  "validate.double_inclusion_of_consensus_operation": {
    description:
      "Double inclusion of consensus operation. Double inclusion of consensus operation. ",
    category: "temporary",
  },
  "validate.operation.already_dal_denounced": {
    description:
      "Already denounced for DAL entrapement. The same DAL denunciation has already been validated. ",
    category: "temporary",
  },
  "validate.operation.already_denounced": {
    description: "Already denounced. The same denunciation has already been validated. ",
    category: "temporary",
  },
  "validate.operation.already_proposed": {
    description:
      "Already proposed. The delegate has already submitted one of the operation's proposals. ",
    category: "temporary",
  },
  "validate.operation.already_submitted_a_ballot": {
    description:
      "Already submitted a ballot. The delegate has already submitted a ballot for the current voting period. ",
    category: "temporary",
  },
  "validate.operation.ballot_for_wrong_proposal": {
    description:
      "Ballot for wrong proposal. Ballot provided for a proposal that is not the current one. ",
    category: "temporary",
  },
  "validate.operation.block.dal_denunciation_not_allowed_just_after_migration": {
    description:
      "DAL denunciations are not allowed just after migration. DAL denunciations are not allows just after the migration. ",
    category: "temporary",
  },
  "validate.operation.block.inconsistent_denunciation": {
    description:
      "Inconsistent denunciation. A denunciation operation is inconsistent (two distinct delegates) ",
    category: "temporary",
  },
  "validate.operation.block.invalid_dal_shard_index": {
    description:
      "Invalid DAL shard index. The given shard index is out of range of representable shard indices ",
    category: "temporary",
  },
  "validate.operation.block.invalid_denunciation": {
    description: "Invalid denunciation. A denunciation is malformed ",
    category: "temporary",
  },
  "validate.operation.block.outdated_dal_denunciation": {
    description: "Outdated DAL denunciation. A DAL denunciation is outdated. ",
    category: "temporary",
  },
  "validate.operation.block.outdated_denunciation": {
    description: "Outdated denunciation. A denunciation is outdated. ",
    category: "temporary",
  },
  "validate.operation.block.too_early_dal_denunciation": {
    description: "Too early DAL denunciation. A DAL denunciation is for a future level ",
    category: "temporary",
  },
  "validate.operation.block.too_early_denunciation": {
    description: "Too early denunciation. A denunciation is for a future level ",
    category: "temporary",
  },
  "validate.operation.conflict_too_many_proposals": {
    description:
      "Conflict too many proposals. The delegate exceeded the maximum number of allowed proposals due to, among others, previous Proposals operations in the current block/mempool. ",
    category: "temporary",
  },
  "validate.operation.conflicting_activation": {
    description:
      "Account already activated in current validation_state. The account has already been activated by a previous operation in the current validation state. ",
    category: "temporary",
  },
  "validate.operation.conflicting_ballot": {
    description:
      "Conflicting ballot. The delegate has already submitted a ballot in a previously validated operation of the current block or mempool. ",
    category: "temporary",
  },
  "validate.operation.conflicting_dal_entrapment": {
    description:
      "Conflicting DAL entrapment in the current validation state). A DAL entrapment evidence for the same level and a larger DAL attestation has already been validated for the current validation state. ",
    category: "temporary",
  },
  "validate.operation.conflicting_denunciation": {
    description:
      "Conflicting denunciation in current validation state. The same denunciation has already been validated in the current validation state. ",
    category: "temporary",
  },
  "validate.operation.conflicting_drain": {
    description:
      "Conflicting drain in the current validation state). A manager operation or another drain operation is in conflict. ",
    category: "temporary",
  },
  "validate.operation.conflicting_nonce_revelation": {
    description:
      "Conflicting nonce revelation in the current validation state). A revelation for the same nonce has already been validated for the current validation state. ",
    category: "temporary",
  },
  "validate.operation.conflicting_proposals": {
    description:
      "Conflicting proposals. The current block/mempool already contains a testnest dictator proposals operation, so it cannot have any other voting operation. ",
    category: "temporary",
  },
  "validate.operation.conflicting_vdf_revelation": {
    description:
      "Conflicting vdf revelation in the current validation state). A revelation for the same vdf has already been validated for the current validation state. ",
    category: "temporary",
  },
  "validate.operation.empty_proposals": {
    description: "Empty proposals. Proposal list cannot be empty. ",
    category: "temporary",
  },
  "validate.operation.failing_noop_error": {
    description: "Failing_noop error. A failing_noop operation can never be validated. ",
    category: "temporary",
  },
  "validate.operation.gas_quota_exceeded_init_deserialize": {
    description:
      "Not enough gas for initial deserialization of script expressions. Gas limit was not high enough to deserialize the transaction parameters or origination script code or initial storage etc., making the operation impossible to parse within the provided gas bounds. ",
    category: "temporary",
  },
  "validate.operation.inconsistent_counters": {
    description:
      "Inconsistent counters in operation. Inconsistent counters in operation batch. Counters must be increasing and consecutive. ",
    category: "temporary",
  },
  "validate.operation.inconsistent_sources": {
    description:
      "Inconsistent sources in operation batch. Inconsistent sources in operation batch. All operations in a batch must have the same source. ",
    category: "temporary",
  },
  "validate.operation.incorrect_reveal_position": {
    description:
      "Incorrect reveal position. Incorrect reveal operation position in batch: only allowed in first position. ",
    category: "temporary",
  },
  "validate.operation.insufficient_gas_for_manager": {
    description:
      "Not enough gas for initial manager cost. Gas limit is too low to cover the initial cost of manager operations: a minimum of 100 gas units is required. ",
    category: "temporary",
  },
  "validate.operation.invalid_activation": {
    description:
      "Invalid activation. The given key and secret do not correspond to any existing preallocated contract. ",
    category: "temporary",
  },
  "validate.operation.manager_restriction": {
    description:
      "Manager restriction. An operation with the same manager has already been validated in the current block. ",
    category: "temporary",
  },
  "validate.operation.proposals_contain_duplicate": {
    description:
      "Proposals contain duplicate. The list of proposals contains a duplicate element. ",
    category: "temporary",
  },
  "validate.operation.source_not_in_vote_listings": {
    description: "Source not in vote listings. The delegate is not in the vote listings. ",
    category: "temporary",
  },
  "validate.operation.testnet_dictator_multiple_proposals": {
    description:
      "Testnet dictator multiple proposals. A testnet dictator cannot submit more than one proposal at a time. ",
    category: "temporary",
  },
  "validate.operation.wrong_voting_period_index": {
    description:
      "Wrong voting period index. The voting operation contains a voting period index different from the current one. ",
    category: "temporary",
  },
  "validate.operation.wrong_voting_period_kind": {
    description:
      "Wrong voting period kind. The voting operation is incompatible the current voting period kind. ",
    category: "temporary",
  },
  "validate.operation.zk_rollup_disabled": {
    description: "ZK rollups are disabled. ZK rollups will be enabled in a future proposal. ",
    category: "temporary",
  },
  "validate.preattestation_round_too_high": {
    description: "Preattestation round too high. Preattestation round too high. ",
    category: "temporary",
  },
  "validate.temporarily_forbidden_delegate": {
    description:
      "Temporarily forbidden delegate. The delegate has committed too many misbehaviours. ",
    category: "temporary",
  },
  "validate.unexpected_attestation_in_block": {
    description: "Unexpected attestation in block. Unexpected attestation in block. ",
    category: "temporary",
  },
  "validate.unexpected_preattestation_in_block": {
    description: "Unexpected preattestation in block. Unexpected preattestation in block. ",
    category: "temporary",
  },
  "validate.wrong_payload_hash_for_consensus_operation": {
    description:
      "Wrong payload hash for consensus operation. Wrong payload hash for consensus operation. ",
    category: "temporary",
  },
  "validate.wrong_slot_for_consensus_operation": {
    description:
      "Wrong slot for consensus operation. Wrong slot used for a preattestation or attestation. ",
    category: "temporary",
  },
  "vdf.previously_revealed": {
    description: "Previously revealed VDF. Duplicate VDF revelation in cycle ",
    category: "temporary",
  },
  "vdf.too_early_revelation": {
    description:
      "Too early VDF revelation. VDF revelation before the end of the nonce revelation period ",
    category: "temporary",
  },
  "vdf.unverified_result": {
    description: "Unverified VDF. VDF verification failed ",
    category: "temporary",
  },
  viewCallbackOriginationFailed: {
    description: "View callback origination failed. View callback origination failed ",
    category: "temporary",
  },
  viewNeverReturns: {
    description:
      "A view never returned a transaction to the given callback contract. A view never initiated a transaction to the given callback contract. ",
    category: "temporary",
  },
  viewNotFound: {
    description: "A view could not be found. The contract does not have a view of the given name. ",
    category: "temporary",
  },
  viewUnexpectedReturn: {
    description:
      "A view returned an unexpected list of operations. A view initiated a list of operations while the TZIP-4 standard expects only a transaction to the given callback contract. ",
    category: "temporary",
  },
  viewedContractHasNoScript: {
    description: "Viewed contract has no script. A view was called on a contract with no script. ",
    category: "temporary",
  },
  viewerUnexpectedStorage: {
    description:
      "A VIEW instruction returned an unexpected value. A VIEW instruction returned an unexpected value. ",
    category: "temporary",
  },
  wrong_fitness: { description: "Wrong fitness. Wrong fitness. ", category: "temporary" },
  zk_rollup_does_not_exist: {
    description:
      "ZK Rollup does not exist. Attempted to use a ZK rollup that has not been originated. ",
    category: "temporary",
  },
  "zk_rollup_invalid_op code": {
    description: "Invalid op code in append. Invalid op code in append ",
    category: "temporary",
  },
  zk_rollup_negative_length: {
    description:
      "Negative length for pending list prefix. Negative length for pending list prefix ",
    category: "temporary",
  },
  zk_rollup_pending_list_too_short: {
    description: "Pending list is too short. Pending list is too short ",
    category: "temporary",
  },
  zk_rollup_ticket_payload_size_limit_exceeded: {
    description:
      "The payload of the deposited ticket exceeded the size limit. The payload of the deposited ticket exceeded the size limit ",
    category: "temporary",
  },
  "node.bootstrap_pipeline.invalid_locator": {
    description: "Invalid block locator. Block locator is invalid. ",
    category: "permanent",
  },
  "node.bootstrap_pipeline.too_short_locator": {
    description: "Too short locator. Block locator is too short. ",
    category: "permanent",
  },
  "node.config.trusted_setup_not_found": {
    description: "No trusted setup found. No trusted setup found in the explored paths ",
    category: "permanent",
  },
  "node.mempool.rejected_by_full_mempool": {
    description:
      "Operation fees are too low to be considered in full mempool. Operation fees are too low to be considered in full mempool ",
    category: "temporary",
  },
  "node.mempool.removed_from_full_mempool": {
    description:
      "Operation removed from full mempool because its fees are too low. Operation removed from full mempool because its fees are too low ",
    category: "temporary",
  },
  "node.p2p_conn.peer_discovery_disabled": {
    description:
      "Peer discovery disabled. The peer discovery is disabled, sending advertise messages is forbidden. ",
    category: "permanent",
  },
  "node.p2p_connect_handler.identity_check_failure": {
    description:
      "Unexpected peer identity. Peer announced an identity which does not match the one specified on the command-line. ",
    category: "permanent",
  },
  "node.p2p_io_scheduler.connection_closed": {
    description: "Connection closed. IO error: connection with a peer is closed. ",
    category: "permanent",
  },
  "node.p2p_io_scheduler.connection_error": {
    description: "Connection error. IO error: connection error while reading from a peer. ",
    category: "permanent",
  },
  "node.p2p_maintenance.disabled": {
    description:
      "Maintenance disabled. Attempt to trigger the maintenance failed as the maintenance is disabled. ",
    category: "permanent",
  },
  "node.p2p_pool.connected": {
    description: "Connected. Fail to connect with a peer: a connection is already established. ",
    category: "permanent",
  },
  "node.p2p_pool.connection_failed": {
    description: "TCP connection failed. TCP connection failed (refused or no route to host). ",
    category: "permanent",
  },
  "node.p2p_pool.disabled": {
    description: "P2P layer disabled. The P2P layer on this node is not active. ",
    category: "permanent",
  },
  "node.p2p_pool.peer_banned": {
    description: "Peer Banned. The peer identity you tried to connect is banned. ",
    category: "permanent",
  },
  "node.p2p_pool.pending_connection": {
    description:
      "Pending connection. Fail to connect with a peer: a connection is already pending. ",
    category: "permanent",
  },
  "node.p2p_pool.point_banned": {
    description: "Point Banned. The address you tried to connect is banned. ",
    category: "permanent",
  },
  "node.p2p_pool.private_mode": {
    description: "Private mode. Node is in private mode. ",
    category: "permanent",
  },
  "node.p2p_pool.rejected": {
    description: "Rejected peer. Connection to peer was rejected by us. ",
    category: "permanent",
  },
  "node.p2p_pool.too_many_connections": {
    description: "Too many connections. Too many connections. ",
    category: "permanent",
  },
  "node.p2p_socket.decipher_error": {
    description: "Decipher error. An error occurred while deciphering. ",
    category: "permanent",
  },
  "node.p2p_socket.decoding_error": {
    description: "Decoding error. An error occurred while decoding. ",
    category: "permanent",
  },
  "node.p2p_socket.invalid_auth": {
    description: "Invalid authentication. Rejected peer connection: invalid authentication. ",
    category: "permanent",
  },
  "node.p2p_socket.invalid_chunks_size": {
    description: "Invalid chunks size. Size of chunks is not valid. ",
    category: "permanent",
  },
  "node.p2p_socket.invalid_incoming_ciphertext_size": {
    description:
      "Invalid incoming ciphertext size. The announced size for the incoming ciphertext is invalid. ",
    category: "permanent",
  },
  "node.p2p_socket.invalid_message_size": {
    description: "Invalid message size. The size of the message to be written is invalid. ",
    category: "permanent",
  },
  "node.p2p_socket.myself": {
    description: "Myself. Remote peer is actually yourself. ",
    category: "permanent",
  },
  "node.p2p_socket.not_enough_proof_of_work": {
    description:
      "Not enough proof of work. Remote peer cannot be authenticated: not enough proof of work. ",
    category: "permanent",
  },
  "node.p2p_socket.rejected_by_nack": {
    description:
      "Rejected socket connection by Nack. Rejected peer connection: The peer rejected the socket connection by Nack with a list of alternative peers. ",
    category: "permanent",
  },
  "node.p2p_socket.rejected_no_common_protocol": {
    description:
      "Rejected socket connection - no common network protocol. Rejected peer connection: rejected socket connection as we have no common network protocol with the peer. ",
    category: "permanent",
  },
  "node.p2p_socket.rejected_socket_connection": {
    description:
      "Rejected socket connection. Rejected peer connection: rejected socket connection. ",
    category: "permanent",
  },
  "node.p2p_socket.rejecting_incoming": {
    description: "Rejecting socket connection. Rejecting peer connection with motive. ",
    category: "permanent",
  },
  "node.peer_validator.known_invalid": {
    description: "Known invalid. Known invalid block found in the peer's chain ",
    category: "permanent",
  },
  "node.peer_validator.unknown_ancestor": {
    description: "Unknown ancestor. Unknown ancestor block found in the peer's chain ",
    category: "permanent",
  },
  "node.prevalidation.future_block_header": {
    description: "Future block header. The block was annotated with a time too far in the future. ",
    category: "temporary",
  },
  "node.prevalidation.oversized_operation": {
    description: "Oversized operation. The operation size is bigger than allowed. ",
    category: "permanent",
  },
  "node.prevalidation.parse_error": {
    description:
      "Parsing error in prevalidation. Raised when an operation has not been parsed correctly during prevalidation. ",
    category: "permanent",
  },
  "node.prevalidation.too_many_operations": {
    description:
      "Too many pending operations in prevalidation. The prevalidation context is full. ",
    category: "temporary",
  },
  "node.protocol_validator.cannot_load_protocol": {
    description: "Cannot load protocol. Cannot load protocol from disk ",
    category: "permanent",
  },
  "node.protocol_validator.invalid_protocol": {
    description: "Invalid protocol. Invalid protocol. ",
    category: "permanent",
  },
  "node.state.bad_data_dir": {
    description:
      "Bad data directory. The data directory could not be read. This could be because it was generated with an old version of the octez-node program. Deleting and regenerating this directory may fix the problem. ",
    category: "permanent",
  },
  "node.state.block.inconsistent_context_hash": {
    description:
      "Inconsistent commit hash. When committing the context of a block, the announced context hash was not the one computed at commit time. ",
    category: "permanent",
  },
  "node.state.block.missing_block_metadata_hash": {
    description:
      "Missing block metadata hash. A block was expected to commit to a block metadata hash, however none was given. ",
    category: "permanent",
  },
  "node.state.block.missing_operation_metadata_hashes": {
    description:
      "Missing operation metadata hashes. A block was expected to commit to operation metadata hashes, however none were given. ",
    category: "permanent",
  },
  "node.state.block_not_invalid": {
    description: "Block not invalid. The invalid block to be unmarked was not actually invalid. ",
    category: "permanent",
  },
  "node.state.unknown_chain": {
    description:
      "Unknown chain. The chain identifier could not be found in the chain identifiers table. ",
    category: "permanent",
  },
  "node.validator.checkpoint_error": {
    description:
      "Block incompatible with the current checkpoint. The block belongs to a branch that is not compatible with the current checkpoint. ",
    category: "branch",
  },
  "node.validator.inactive_chain": {
    description: "Inactive chain. Attempted validation of a block from an inactive chain. ",
    category: "branch",
  },
  "validator.cannot_process_request_while_shutting_down": {
    description:
      "Cannot process request while shutting down. Cannot process request while the node is shutting down. ",
    category: "temporary",
  },
  "validator.inconsistent_operations_hash": {
    description:
      "Invalid merkle tree. The provided list of operations is inconsistent with the block header. ",
    category: "temporary",
  },
  "validator.invalid_block": {
    description: "Invalid block. Invalid block. ",
    category: "permanent",
  },
  "validator.missing_test_protocol": {
    description: "Missing test protocol. Missing test protocol when forking the test chain ",
    category: "temporary",
  },
  "validator.unavailable_protocol": {
    description: "Missing protocol. The protocol required for validating a block is missing. ",
    category: "temporary",
  },
  "validator.validation_process_failed": {
    description:
      "Validation process failed. Failed to validate block using external validation process. ",
    category: "temporary",
  },
  "micheline.parse_error.annotation_exceeds_max_length": {
    description:
      "Micheline parser error: annotation exceeds max length. While parsing a piece of Micheline source, an annotation exceeded the maximum length (255). ",
    category: "permanent",
  },
  "micheline.parse_error.empty_expression": {
    description:
      "Micheline parser error: empty_expression. Tried to interpret an empty piece or Micheline source as a single expression. ",
    category: "permanent",
  },
  "micheline.parse_error.extra_token": {
    description:
      "Micheline parser error: extra token. While parsing a piece of Micheline source, an extra semi colon or parenthesis was encountered. ",
    category: "permanent",
  },
  "micheline.parse_error.invalid_hex_bytes": {
    description:
      "Micheline parser error: invalid hex bytes. While parsing a piece of Micheline source, a byte sequence (0x...) was not valid as a hex byte. ",
    category: "permanent",
  },
  "micheline.parse_error.invalid_utf8_sequence": {
    description:
      "Micheline parser error: invalid UTF-8 sequence. While parsing a piece of Micheline source, a sequence of bytes that is not valid UTF-8 was encountered. ",
    category: "permanent",
  },
  "micheline.parse_error.misaligned_node": {
    description:
      "Micheline parser error: misaligned node. While parsing a piece of Micheline source, an expression was not aligned with its siblings of the same mother application or sequence. ",
    category: "permanent",
  },
  "micheline.parse_error.missing_break_after_number": {
    description:
      "Micheline parser error: missing break after number. While parsing a piece of Micheline source, a number was not visually separated from its follower token, leading to misreadability. ",
    category: "permanent",
  },
  "micheline.parse_error.unclosed_token": {
    description:
      "Micheline parser error: unclosed token. While parsing a piece of Micheline source, a parenthesis or a brace was unclosed. ",
    category: "permanent",
  },
  "micheline.parse_error.undefined_escape_sequence": {
    description:
      "Micheline parser error: undefined escape sequence. While parsing a piece of Micheline source, an unexpected escape sequence was encountered in a string. ",
    category: "permanent",
  },
  "micheline.parse_error.unexpected_character": {
    description:
      "Micheline parser error: unexpected character. While parsing a piece of Micheline source, an unexpected character was encountered. ",
    category: "permanent",
  },
  "micheline.parse_error.unexpected_token": {
    description:
      "Micheline parser error: unexpected token. While parsing a piece of Micheline source, an unexpected token was encountered. ",
    category: "permanent",
  },
  "micheline.parse_error.unterminated_comment": {
    description:
      "Micheline parser error: unterminated comment. While parsing a piece of Micheline source, a commentX was not terminated. ",
    category: "permanent",
  },
  "micheline.parse_error.unterminated_integer": {
    description:
      "Micheline parser error: unterminated integer. While parsing a piece of Micheline source, an integer was not terminated. ",
    category: "permanent",
  },
  "micheline.parse_error.unterminated_string": {
    description:
      "Micheline parser error: unterminated string. While parsing a piece of Micheline source, a string was not terminated. ",
    category: "permanent",
  },
  "rpc_client.request_failed": { description: "Request failed. ", category: "permanent" },
  "Block_validator_process.applying_non_validated_block": {
    description: "Applying non validated block. Applying non validated block ",
    category: "permanent",
  },
  "Block_validator_process.failed_to_checkout_context": {
    description: "Fail during checkout context. The context checkout failed using a given hash ",
    category: "permanent",
  },
  "RPC.Empty_error_list": {
    description:
      "RPC returned an empty list of errors. The RPC returned with an error code but no associated error. ",
    category: "branch",
  },
  "RPC.Unexpected_error_encoding": {
    description:
      "RPC fails with an unparsable error message. The RPC returned with an error code, and the associated body was not a valid error trace. It is likely that the answer does not comes directly from a compatible node. ",
    category: "branch",
  },
  "RPC_context.Gone": {
    description:
      "RPC lookup failed because of deleted data. RPC lookup failed. Block has been pruned and requested data deleted. ",
    category: "branch",
  },
  "RPC_context.Not_found": {
    description:
      "RPC lookup failed. RPC lookup failed. No RPC exists at the URL or the RPC tried to access non-existent data. ",
    category: "branch",
  },
  "RPC_error.bad_version": {
    description: "Unknown RPC version. The RPC was called with a bad version number. ",
    category: "permanent",
  },
  "Validator_process.system_error_while_validating": {
    description:
      "Failed to validate block because of a system error. The validator failed because of a system error ",
    category: "temporary",
  },
  bitfield_invalid_input: {
    description: "Invalid argument. A bitset function was provided an invalid input ",
    category: "permanent",
  },
  bitfield_invalid_position: {
    description: "Invalid bitfield’s position. Bitfields do not accept negative positions ",
    category: "permanent",
  },
  "block_validation.cannot_serialize_metadata": {
    description: "Cannot serialize metadata. Unable to serialize metadata ",
    category: "permanent",
  },
  "brassaia.context_hash.unsupported_version": {
    description: "Unsupported context hash version. Unsupported context hash version. ",
    category: "permanent",
  },
  canceled: {
    description: "Canceled. A promise was unexpectedly canceled ",
    category: "temporary",
  },
  cannot_connect_to_node_socket: {
    description:
      "Cannot connect to node socket. External validator failed to connect to the node's socket ",
    category: "temporary",
  },
  "cli.key.invalid_uri": {
    description: "Invalid key uri. A key has been provided with an invalid uri. ",
    category: "permanent",
  },
  "cli.signature_mismatch": {
    description: "Signature mismatch. The signer produced an invalid signature ",
    category: "permanent",
  },
  "cli.unexisting_scheme": {
    description: "Unexisting scheme. The requested scheme does not exist ",
    category: "permanent",
  },
  "cli.unregistered_key_scheme": {
    description:
      "Unregistered key scheme. A key has been provided with an unregistered scheme (no corresponding plugin) ",
    category: "permanent",
  },
  "cli.wrong_key_scheme": {
    description:
      "Wrong key scheme. A certain scheme type has been requested but another one was found ",
    category: "permanent",
  },
  "client.alpha.Bad deserialized counter": {
    description:
      "Deserialized counter does not match the stored one. The byte sequence references a multisig counter that does not match the one currently stored in the given multisig contract ",
    category: "permanent",
  },
  "client.alpha.ForbiddenNegativeInt": {
    description: "Forbidden negative int. invalid number, must a non negative natural  ",
    category: "permanent",
  },
  "client.alpha.InvalidAddressForSmartContract": {
    description:
      "Invalid address for smart contract. Invalid input, expected a smart contract address in base58 check notation (KT1...) ",
    category: "permanent",
  },
  "client.alpha.actionDeserialisation": {
    description:
      "The expression is not a valid multisig action. When trying to deserialise an action from a sequence of bytes, we got an expression that does not correspond to a known multisig action ",
    category: "permanent",
  },
  "client.alpha.actionUnwrappingError": {
    description:
      "The argument is not for an FA1.2 parameter. The argument's type does not correspond to that of the corresponding FA1.2 entrypoint. ",
    category: "permanent",
  },
  "client.alpha.badDeserializedContract": {
    description:
      "The byte sequence is not for the given multisig contract. When trying to deserialise an action from a sequence of bytes, we got an action for another multisig contract ",
    category: "permanent",
  },
  "client.alpha.badMaxPriorityArg": {
    description: "Bad -max-priority arg. invalid priority in -max-priority ",
    category: "permanent",
  },
  "client.alpha.badMaxWaitingTimeArg": {
    description: "Bad -max-waiting-time arg. invalid duration in -max-waiting-time ",
    category: "permanent",
  },
  "client.alpha.badMinimalFeesArg": {
    description: "Bad -minimal-fees arg. invalid fee threshold in -fee-threshold ",
    category: "permanent",
  },
  "client.alpha.badPreservedLevelsArg": {
    description: "Bad -preserved-levels arg. invalid number of levels in -preserved-levels ",
    category: "permanent",
  },
  "client.alpha.badTezArg": {
    description: "Bad Tez Arg. Invalid ꜩ notation in parameter. ",
    category: "permanent",
  },
  "client.alpha.bytesDeserialisation": {
    description:
      "The byte sequence is not a valid multisig action. When trying to deserialise an action from a sequence of bytes, we got an error ",
    category: "permanent",
  },
  "client.alpha.contractHasNoScript": {
    description:
      "The given contract is not a multisig contract because it has no script. A multisig command has referenced a scriptless smart contract instead of a multisig smart contract. ",
    category: "permanent",
  },
  "client.alpha.contractHasNoStorage": {
    description:
      "The given contract is not a multisig contract because it has no storage. A multisig command has referenced a smart contract without storage instead of a multisig smart contract. ",
    category: "permanent",
  },
  "client.alpha.contractHasUnexpectedStorage": {
    description:
      "The storage of the given contract is not of the shape expected for a multisig contract. A multisig command has referenced a smart contract whose storage is of a different shape than the expected one. ",
    category: "permanent",
  },
  "client.alpha.contractWithoutCode": {
    description:
      "The given contract has no code. Attempt to get the code of a contract failed because it has nocode. No scriptless contract should remain. ",
    category: "permanent",
  },
  "client.alpha.entrypointMismatch": {
    description:
      "The given contract does not implement the FA1.2 interface. An FA1.2 command has referenced a smart contract whose script does not implement at least one FA1.2 entrypoint, or with an incompatible type. See TZIP-7 (https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-7/tzip-7.md) for documentation on FA1.2. ",
    category: "permanent",
  },
  "client.alpha.fa12ContractHasNoScript": {
    description:
      "The given contract is not a smart contract. An FA1.2 command has referenced a scriptless contract. ",
    category: "permanent",
  },
  "client.alpha.fa12ContractHasNoStorage": {
    description:
      "The given contract has no storage. An FA1.2 command made a call on a contract that has no storage. ",
    category: "permanent",
  },
  "client.alpha.fa12UnexpectedError": {
    description:
      "Unexpected error during FA1.2 contract interpretation. An unexpected Michelson error was reached during the interpretation of an FA1.2 contract. ",
    category: "permanent",
  },
  "client.alpha.illTypedArgumentForMultisig": {
    description:
      "Ill-typed argument in multi-signed transfer. The provided argument for a transfer from a multisig contract is ill-typed ",
    category: "permanent",
  },
  "client.alpha.illTypedLambdaForMultisig": {
    description:
      "Ill-typed lambda for multi-signed transfer. The provided lambda for a transfer from a multisig contract is ill-typed ",
    category: "permanent",
  },
  "client.alpha.invalidSignature": {
    description:
      "The following signature did not match a public key in the given multisig contract. A signature was given for a multisig contract that matched none of the public keys of the contract signers ",
    category: "permanent",
  },
  "client.alpha.michelson.macros.bas_arity": {
    description:
      "Wrong number of arguments to macro. A wrong number of arguments was provided to a macro ",
    category: "permanent",
  },
  "client.alpha.michelson.macros.sequence_expected": {
    description:
      "Macro expects a sequence. An macro expects a sequence, but a sequence was not provided ",
    category: "permanent",
  },
  "client.alpha.michelson.macros.unexpected_annotation": {
    description:
      "Unexpected annotation. A macro had an annotation, but no annotation was permitted on this macro. ",
    category: "permanent",
  },
  "client.alpha.michelson.stack.wrong_stack": {
    description: "Wrong stack. Failed to parse a typed stack. ",
    category: "permanent",
  },
  "client.alpha.michelson.stack.wrong_stack_item": {
    description: "Wrong stack item. Failed to parse an item in a typed stack. ",
    category: "permanent",
  },
  "client.alpha.michelson.wrong_extra_big_maps": {
    description:
      "Wrong description of a list of extra big maps. Failed to parse a description of extra big maps. ",
    category: "permanent",
  },
  "client.alpha.michelson.wrong_extra_big_maps_item": {
    description:
      "Wrong description of an extra big map. Failed to parse an item in a description of extra big maps. ",
    category: "permanent",
  },
  "client.alpha.michelson.wrong_other_contracts": {
    description:
      "Wrong description of a list of other contracts. Failed to parse a description of other contracts. ",
    category: "permanent",
  },
  "client.alpha.michelson.wrong_other_contracts_item": {
    description:
      "Wrong description of an other contract. Failed to parse an item in a description of other contracts. ",
    category: "permanent",
  },
  "client.alpha.nonPositiveThreshold": {
    description:
      "Given threshold is not positive. A multisig threshold should be a positive number ",
    category: "permanent",
  },
  "client.alpha.notASupportedMultisigContract": {
    description:
      "The given contract is not one of the supported contracts. A multisig command has referenced a smart contract whose script is not one of the known multisig contract scripts. ",
    category: "permanent",
  },
  "client.alpha.notAViewableEntrypoint": {
    description:
      "The entrypoint is not viewable. A transaction made a call on an entrypoint expecting it to implement the 'view' type. ",
    category: "permanent",
  },
  "client.alpha.notAnEntrypoint": {
    description:
      "The expression is not for an entrypoint. The parameter value of the contract call refers to a non-existing entrypoint. ",
    category: "permanent",
  },
  "client.alpha.notEnoughAllowance": {
    description:
      "The sender does not have enough allowance. An FA1.2 transfer failed because the receiver does not have enough allowance to ask for a transfer from the sender. ",
    category: "permanent",
  },
  "client.alpha.notEnoughBalance": {
    description:
      "The sender does not have enough balance. An FA1.2 transfer failed because the sender does not have enough balance. ",
    category: "permanent",
  },
  "client.alpha.notEnoughSignatures": {
    description:
      "Not enough signatures were provided for this multisig action. To run an action on a multisig contract, you should provide at least as many signatures as indicated by the threshold stored in the multisig contract. ",
    category: "permanent",
  },
  "client.alpha.thresholdTooHigh": {
    description:
      "Given threshold is too high. The given threshold is higher than the number of keys, this would lead to a frozen multisig contract ",
    category: "permanent",
  },
  "client.alpha.tzt.duplicated_toplevel": {
    description:
      "Duplicated TZT toplevel primitive. A toplevel TZT primitive was used several times. ",
    category: "permanent",
  },
  "client.alpha.tzt.invalid_format": {
    description:
      "Invalid format for a TZT toplevel primitive. Invalid format for a TZT toplevel primitive ",
    category: "permanent",
  },
  "client.alpha.tzt.invalid_toplevel": {
    description: "Invalid format for TZT toplevel entry. Invalid format for a TZT toplevel entry ",
    category: "permanent",
  },
  "client.alpha.tzt.missing_mandatory": {
    description:
      "Missing TZT mandatory toplevel primitive. A mandatory toplevel TZT primitive was missing. ",
    category: "permanent",
  },
  "client.alpha.tzt.unknown_toplevel": {
    description: "Unknown TZT toplevel primitive. A toplevel TZT primitive was unknown. ",
    category: "permanent",
  },
  "client.alpha.tzt.wrong_toplevel_arity": {
    description:
      "Wrong arity for a TZT toplevel primitive. A known toplevel TZT primitive was used with a bad arity. ",
    category: "permanent",
  },
  "client.alpha.unsafeAllowanceChange": {
    description:
      "The allowance change is unsafe. An FA1.2 non-zero allowance change failed because the current allowance is non-zero. For more explanation on why such allowance change is unsafe, please look at TZIP-7 (https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-7/tzip-7.md#approve). ",
    category: "permanent",
  },
  "client.alpha.unsupportedGenericMultisigFeature": {
    description:
      "Unsupported multisig feature: generic call. This multisig contract does not feature calling contracts with arguments ",
    category: "permanent",
  },
  "client.alpha.unsupportedGenericMultisigFeatureTy": {
    description:
      "Unsupported multisig feature: generic call to non-unit entrypoint. This multisig contract does not feature calling contracts with arguments ",
    category: "permanent",
  },
  "client.alpha.unsupportedGenericMultisigLambda": {
    description:
      "Unsupported multisig feature: running lambda. This multisig contract does not feature running lambdas ",
    category: "permanent",
  },
  "config_file.cannot_switch_history_mode": {
    description: "Cannot switch history mode. Cannot switch history mode. ",
    category: "permanent",
  },
  "context_hash.unsupported_version": {
    description: "Unsupported context hash version. Unsupported context hash version. ",
    category: "permanent",
  },
  "dal.node.invalid_precomputation_hash": {
    description: "Invalid_precomputation_hash. Unexpected precomputation hash ",
    category: "permanent",
  },
  "dal.node.trusted_setup_loading_failed": {
    description: "Trusted setup loading failed. Trusted setup failed to load ",
    category: "permanent",
  },
  decoding_error: {
    description: "Decoding error. Error while decoding a value ",
    category: "permanent",
  },
  encoding_error: {
    description: "Encoding error. Error while encoding a value for a socket ",
    category: "permanent",
  },
  "external_process.cannot_create_socket": {
    description: "Cannot create socket. Cannot create socket for external process. ",
    category: "temporary",
  },
  "external_process.socket_path_too_long": {
    description: "Socket path too long. Socket path too long. ",
    category: "temporary",
  },
  "external_process.socket_path_wrong_permission": {
    description: "Wrong permission for socket path. Wrong permission for socket path. ",
    category: "temporary",
  },
  injection_operation_error_case: {
    description:
      "Injection operation error. The injection of this operation failed. The error trace are the following errors in this list. ",
    category: "permanent",
  },
  injection_operation_succeed_case: {
    description:
      "Injection operation succeed. The injection of this operation succeed among a list of injections containing at least one error. ",
    category: "permanent",
  },
  injection_operations_error: {
    description:
      "Injection operations error. While injecting several operations at once, one or several injections failed. ",
    category: "permanent",
  },
  "internal-event-activation-error": {
    description:
      "Internal Event Sink: Wrong Activation URI. Activation of an Internal Event SINK with an URI failed ",
    category: "permanent",
  },
  io_error: { description: "IO error. IO error ", category: "permanent" },
  "prevalidation.operation_conflict": {
    description:
      "Operation conflict. The operation cannot be added because the mempool already contains a conflicting operation. ",
    category: "temporary",
  },
  "prevalidation.operation_replacement": {
    description: "Operation replacement. The operation has been replaced. ",
    category: "temporary",
  },
  "snapshots.inconsistent_operation_hashes": {
    description: "Inconsistent operation hashes. The operations given do not match their hashes. ",
    category: "permanent",
  },
  "socket.unexpected_size_of_decoded_value": {
    description:
      "Unexpected size of decoded value. A decoded value comes from a buffer of unexpected size. ",
    category: "permanent",
  },
  "stdlib_unix.cannot_load_stored_data": {
    description: "Cannod load stored data. Failed to load stored data ",
    category: "permanent",
  },
  "stdlib_unix.closed": {
    description: "Key value stored was closed. Action performed while the store is closed ",
    category: "permanent",
  },
  "stdlib_unix.corrupted_data": {
    description: "key value store data is corrupted. A data of the key value store was corrupted ",
    category: "permanent",
  },
  "stdlib_unix.decoding_failed": {
    description:
      "key value store failed to decode the data. A failure was triggered while decoding the data ",
    category: "permanent",
  },
  "stdlib_unix.encoding_failed": {
    description:
      "key value store failed to encode the data. A failure was triggered while encoding the data ",
    category: "permanent",
  },
  "stdlib_unix.missing_kvs_data": {
    description: "Missing stored data from KVS. Failed to load stored data from KVS ",
    category: "permanent",
  },
  "stdlib_unix.wrong_encoded_value_size": {
    description:
      "Wrong encoded value size. Try to write a value that does not match the expected size ",
    category: "permanent",
  },
  "store.bad_head_invariant": {
    description: "Bad head invariant. Bad invariant during Store.set_head ",
    category: "permanent",
  },
  "store.bad_level": {
    description: "Bad level. Read a block at level past our current head. ",
    category: "permanent",
  },
  "store.bad_ordering_invariant": {
    description: "Bad ordering invariant. The ordering invariant does not hold ",
    category: "permanent",
  },
  "store.block_not_found": {
    description: "Block not found. Block not found ",
    category: "permanent",
  },
  "store.cannot_cement_blocks": {
    description: "Cannot cement blocks. Cannot cement blocks ",
    category: "temporary",
  },
  "store.cannot_cement_blocks_metadata": {
    description: "Cannot cement blocks metadata. Cannot cement blocks metadata ",
    category: "temporary",
  },
  "store.cannot_checkout_context": {
    description: "Cannot checkout context. Failed to checkout context ",
    category: "temporary",
  },
  "store.cannot_encode_block": {
    description: "Cannot encode block. Failed to encode block ",
    category: "temporary",
  },
  "store.cannot_find_chain_dir": {
    description: "Cannot find chain dir. Cannot find chain dir while upgrading storage ",
    category: "permanent",
  },
  "store.cannot_find_protocol": {
    description: "Cannot find protocol. Cannot find protocol ",
    category: "temporary",
  },
  "store.cannot_fork_testchain": {
    description: "Cannot fork testchain. Failed to fork testchain ",
    category: "temporary",
  },
  "store.cannot_instanciate_temporary_floating_store": {
    description:
      "Cannot instanciate temporary floating store. Cannot instanciate temporary floating store ",
    category: "temporary",
  },
  "store.cannot_load_degraded_store": {
    description: "Cannot load degraded store. Cannot load a degraded block store. ",
    category: "permanent",
  },
  "store.cannot_load_testchain": {
    description: "Cannot load testchain. Failed to load the testchain ",
    category: "temporary",
  },
  "store.cannot_merge_store": {
    description: "Cannot merge store. Cannot merge the store. ",
    category: "permanent",
  },
  "store.cannot_retrieve_savepoint": {
    description: "Cannot retrieve savepoint. Failed to retrieve savepoint ",
    category: "temporary",
  },
  "store.cannot_set_target": {
    description: "Cannot set target. The given block to be set as target is invalid. ",
    category: "temporary",
  },
  "store.cannot_store_block": {
    description: "Cannot store block. Failed to store block ",
    category: "temporary",
  },
  "store.cannot_update_floating_store": {
    description: "Cannot update floating store. Cannot update floating store ",
    category: "temporary",
  },
  "store.cannot_write_in_readonly": {
    description: "Cannot write in readonly. Cannot write data in store when in readonly ",
    category: "permanent",
  },
  "store.corrupted_store": {
    description: "Corrupted store. The store is corrupted ",
    category: "permanent",
  },
  "store.failed_to_get_live_blocks": {
    description: "Fail to get live blocks. Unable to compute live blocks from a given block. ",
    category: "permanent",
  },
  "store.failed_to_init_cemented_block_store": {
    description:
      "Failed to init cemented block store. Failed to initialize the cemented block store ",
    category: "temporary",
  },
  "store.fork_testchain_not_allowed": {
    description: "Fork testchain not allowed. Forking the test chain is not allowed ",
    category: "temporary",
  },
  "store.inconsistent_block_hash": {
    description: "Inconsistent block hash. Inconsistent block hash found ",
    category: "temporary",
  },
  "store.inconsistent_block_predecessor": {
    description: "Inconsistent block predecessor. Inconsistent block predecessor ",
    category: "temporary",
  },
  "store.inconsistent_cemented_file": {
    description: "Inconsistent cemented file. Failed to read a cemented file ",
    category: "temporary",
  },
  "store.inconsistent_cemented_store": {
    description: "Inconsistent cemented store. Failed to check indexes consistency ",
    category: "temporary",
  },
  "store.inconsistent_cementing_highwatermark": {
    description:
      "Inconsistent cementing highwatermark. The stored cementing highwatermark is inconsistent with the store. ",
    category: "permanent",
  },
  "store.inconsistent_chain_store": {
    description: "Inconsistent chain store. Failed to load chain store ",
    category: "temporary",
  },
  "store.inconsistent_genesis": {
    description: "Inconsistent genesis. The given genesis block is inconsistent with the store. ",
    category: "permanent",
  },
  "store.inconsistent_history_mode": {
    description: "Inconsistent history mode. The history mode does not correspond to the store. ",
    category: "permanent",
  },
  "store.inconsistent_protocol_commit_info": {
    description:
      "Inconsistent protocol commit info. Inconsistent protocol commit info while restoring snapshot ",
    category: "temporary",
  },
  "store.inconsistent_store_state": {
    description: "Inconsistent store state. Inconsistent store state ",
    category: "temporary",
  },
  "store.invalid_blocks_to_cement": {
    description: "Invalid blocks to cement. Invalid block list to cement ",
    category: "temporary",
  },
  "store.invalid_genesis_marking": {
    description: "Invalid genesis marking. Cannot mark genesis as invalid ",
    category: "temporary",
  },
  "store.invalid_head_switch": {
    description:
      "Invalid head switch. The given head is not consistent with the current store's savepoint ",
    category: "permanent",
  },
  "store.merge_already_running": {
    description: "Merge already running. The store's merge is already running ",
    category: "temporary",
  },
  "store.merge_error": {
    description: "Merge error. Error while merging the store ",
    category: "temporary",
  },
  "store.metadata_not_found": {
    description: "Block metadata not found. Block metadata not found ",
    category: "permanent",
  },
  "store.missing_activation_block": {
    description: "Missing activation block. Missing activation block while restoring snapshot ",
    category: "temporary",
  },
  "store.missing_commit_info": {
    description: "Missing commit info. Failed to retreive commit info ",
    category: "temporary",
  },
  "store.missing_last_preserved_block": {
    description:
      "Missing last preserved block. Current head's last preserved block (or its associated metadata) cannot be found in the store. ",
    category: "temporary",
  },
  "store.protocol_not_found": {
    description: "Protocol not found. Protocol not found ",
    category: "permanent",
  },
  "store.resulting_context_hash_not_found": {
    description: "Resulting context hash not found. Resulting context hash not found ",
    category: "permanent",
  },
  "store.target_mismatch": {
    description: "target mismatch. Target is reached but it is not a head's ancestor. ",
    category: "permanent",
  },
  "store.temporary_cemented_file_exists": {
    description: "Temporary cemented file exists. The temporary cemented file already exists ",
    category: "temporary",
  },
  "store.unexpected_missing_activation_block": {
    description:
      "Unexpected missing activaiton block. An activation block is unexpectedly missing from the store. ",
    category: "permanent",
  },
  "store.unexpected_missing_block": {
    description: "Unexpected missing block. A block is unexpectedly missing from the store. ",
    category: "permanent",
  },
  "store.unexpected_missing_block_metadata": {
    description:
      "Unexpected missing block metadata. A block's metadata is unexpectedly missing from the store. ",
    category: "permanent",
  },
  "store.unexpected_missing_protocol": {
    description: "Unexpected missing protocol. A protocol is unexpectedly missing from the store. ",
    category: "permanent",
  },
  "store.wrong_floating_kind_swap": {
    description: "Wrong floating kind swap. Try to swap wrong floating store kind ",
    category: "temporary",
  },
  "store.wrong_predecessor": {
    description: "Wrong predecessor. Failed to get block's predecessor ",
    category: "temporary",
  },
  unexpected_size_of_encoded_value: {
    description: "Unexpected size of encoded value. An encoded value is not of the expected size. ",
    category: "permanent",
  },
  "unix.system_info": {
    description: "Unix System_info failure. Unix System_info failure ",
    category: "temporary",
  },
  unix_error: { description: "Unix error. An unhandled unix exception ", category: "temporary" },
  "utils.Timeout": { description: "Timeout. Timeout ", category: "temporary" },
};
