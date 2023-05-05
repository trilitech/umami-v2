# Umami Wallet - Batch File Format Specifications

[[_TOC_]]

## Example

```
tz1Z3JYEXYs88wAdaB6WW8H9tSRVxwuzEQz2,1.23456
tz1cbGwhSRwNt9XVdSnrqb4kzRyRJNAJrQni,1000,KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton,2
tz1cbGwhSRwNt9XVdSnrqb4kzRyRJNAJrQni,2000,KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton
```

> Commentary:
>
> 1. a simple tez transaction, destined for the address in the first field, in the amount of the second field
> 2. a simple fa2 token transaction, defined by the contract in the third field and the tokenid of the fourth field
> 3. a simple fa1.2 token transaction, defined by the contract in the third field

## Abstract

Batch File Format Specifications, as defined herein, allow convenience to scale large batches with the additional benefit of reusability and interoperability across wallets that implement this specification. From a simple, human-readable CSV file, a batch can be loaded into a wallet ready for signature.

## Introduction

Batches offer convenience over simple transactions in that they are validated in one block, plus they are economical both in fees and resources.

For large batches however, it may be tedious to enter the transactions one by one on a wallet user interface. As such, loading of transactions as a CSV definition allows for simple and quick entry of large bulk transactions.

## Definition of the Batch Format

### Batch

The file format defined herein describes a batch of Tezos operations in the [CSV format](https://datatracker.ietf.org/doc/html/rfc4180).

A batch is a collection of operations, which in this definition are necessarily transactions (although they may imply operations, such as reveals).

Any non-empty line in the batch file, that matches a transaction specification as per the section below, describes a transaction.

All transactions described by a CSV line in the file compose the batch.

#### Formal Specification

```
file = transaction *(CRLF transaction) [CRLF]
transaction = teztx | tokentx
teztx = destination COMMA amount CRLF
tokentx = destination COMMA amount COMMA tokenaddr *(COMMA tokenid)
destination = tz[123][A-Za-z0-9]+{33} | KT1[A-Za-z0-9]+{33}
amount = [0-9]+(.[0-9]*)
tokenaddr = KT1[A-Za-z0-9]+{33}
tokenid = [0-9]+
COMMA = %x2C
```

### Transaction

In a wallet setting, the sending account is to be specified outside of the batch definition.

The justification for this is that the batch is agnostic of where the transaction originates; in this way, the batch may be shared and reused.

#### Simple Tez Transaction

As per the [specification](#Formal Specification)'s `teztx` definition, the base-token tez transaction requires:

1. a tz(1|2|3) or KT1 address as the intended destination; and
1. the amount of tez to send

#### Token Transaction

As per the [specification](#Formal Specification)'s `tokentx` definition, a token transaction requires:

1. a tz(1|2|3) or KT1 address as the intended destination;
1. the amount of token to send;
1. the address to the contract that manages the token; and
1. the token_id of the token within the contract (not required for fa1.2 token)

## Exception Handling

If any line does not match a transaction specification, the line, the transaction, the file and the batch are considered invalid.

<br />

---

<br />

Need further assistance? [Ask for help.](https://gitlab.com/nomadic-labs/umami-wallet/umami/-/wikis/FAQ/Ask-for-help)

<br>
