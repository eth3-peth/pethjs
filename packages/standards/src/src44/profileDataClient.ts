/**
 * Copyright (c) 2022 Signum Network
 */
import {Ledger} from '@signumjs/core';
import {ProfileData} from './profileData';
import {Profile} from './typings';
import {SetAccountProfileArgs} from './typings/args/setAccountProfileArgs';
import {SetAliasProfileArgs} from './typings/args/setAliasProfileArgs';


/**
 * Profile Data Client
 *
 * A helper class to get Profile information from accounts, contracts, and/or aliases. It even resolves Profile data from referenced aliases.
 * Furthermore, it helps on updating profile data according to SRC44 specifications.
 * @module standards.SRC44
 */
export class ProfileDataClient {

    /**
     * Instantiates the client.
     * Mind the dependency of the ledger client.
     * @param ledger
     */
    constructor(private ledger: Ledger) {
    }

    /**
     * Gets the profile data from a contract. It also resolved referenced alias profile
     * @param contractId The contract id
     * @return The fetched Profile data. It might throw exceptions if it has no compatible data.
     */
    async getFromContract(contractId: string): Promise<Profile> {
        const account = await this.ledger.contract.getContract(contractId);
        const profile = ProfileData.parse(account.description).get();
        if (profile.alias) {
            profile.resolvedAlias = await this.getFromAliasByName(profile.alias);
        }
        return profile;
    }

    /**
     * Sets an accounts profile data.
     * @param args The arguments
     */
    async setAccountProfile(args: SetAccountProfileArgs) {
        const {name, senderPublicKey, senderPrivateKey, feePlanck, profileData, deadline, referencedTransactionFullHash} = args;
        return this.ledger.account.setAccountInfo({
            name: name || profileData.name,
            description: profileData.stringify(),
            feePlanck,
            senderPublicKey,
            senderPrivateKey,
            deadline,
            referencedTransactionFullHash
        });
    }

    /**
     * Gets the profile data from an account. It also resolved referenced alias profile
     * @param accountId The account id
     * @return The fetched Profile data. It might throw exceptions if it has no compatible data.
     */
    async getFromAccount(accountId: string): Promise<Profile> {
        const account = await this.ledger.account.getAccount({accountId, includeCommittedAmount: false, includeEstimatedCommitment: false});
        const profile = ProfileData.parse(account.description).get();
        if (profile.alias) {
            profile.resolvedAlias = await this.getFromAliasByName(profile.alias);
        }
        return profile;
    }


    /**
     * Sets an alias profile data.
     * @param args The arguments
     */
    async setAliasProfile(args: SetAliasProfileArgs) {
        const {aliasName, senderPublicKey, senderPrivateKey, feePlanck, profileData, deadline, referencedTransactionFullHash} = args;
        return this.ledger.alias.setAlias({
            aliasName,
            aliasURI: profileData.stringify(),
            feePlanck,
            senderPublicKey,
            senderPrivateKey,
            deadline,
            referencedTransactionFullHash
        });
    }

    /**
     * Gets profile data from an alias.
     * @param aliasName The unique alias name
     * @throws If the alias does not have compatible profile data
     */
    async getFromAliasByName(aliasName: string): Promise<Profile> {
        const {aliasURI} = await this.ledger.alias.getAliasByName(aliasName);
        return ProfileData.parse(aliasURI).get();
    }

}