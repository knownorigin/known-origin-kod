#!/usr/bin/env bash

node ./node_modules/.bin/truffle-flattener ./contracts/MolochV1KOD.sol > ./flat/MolochV1KOD.sol;
node ./node_modules/.bin/truffle-flattener ./contracts/GuildBank.sol > ./flat/GuildBank.sol;
