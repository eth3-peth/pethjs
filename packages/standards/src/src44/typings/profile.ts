/**
 * Copyright (c) 2022 Signum Network
 */
import { SRC44ProfileType } from './src44ProfileType';

interface MediaType {
    [key: string]: string;
}

/**
 * Human friendly profile structure
 *
 * See [[SRC44Profile]], [[ProfileData]] and [[ProfileDataBuilder]] to create, update this structure
 *
 * @module standards.SRC44
 */
export interface Profile {
    /**
     * Version Number - Should be 1 for now
     */
    version: number;
    /**
     * Name, maximal 24 characters
     */
    name: string;
    /**
     * Description, maximal 384 characters
     */
    description?: string;
    /**
     * Profile type
     */
    type?: SRC44ProfileType;
    /**
     * IPFS Media Link for the Avatar
     */
    avatar?: MediaType;
    /**
     * IPFS Media Link for the background image
     */
    background?: MediaType;
    /**
     * Homepage - maximal 128 characters
     */
    homePage?: string;
    /**
     * Send Rule - must be a valid regex expression (mind the correct escape sequences)
     */
    sendRule?: RegExp;
    /**
     * A reference to a Signum Alias
     */
    alias?: string;
    /**
     * A reference to a Signum Account
     */
    account?: string;
    /**
     * An arbitrary identifier, i.e. external reference - max 48 characters
     */
    id?: string;
    /**
     * The resolved Profile data from an referenced alias
     */
    resolvedAlias?: Profile;
    /**
     * An IPFS CID reference to more (off-chain) data
     */
    extension?: string;
    /**
     * A list of social media links, maximal 3 URLs, with at maximum 92 characters length
     */
    socialMediaLinks?: string[];

    /**
     * Custom inline extensions...
     */
    [other: string]: unknown;
}
