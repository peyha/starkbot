import { BaseGuild, Guild } from "discord.js";
import { getItem, addSubItem, getSubItem, deleteSubItem, dynamoQueryResponse } from "../dynamodb-libs/dynamodb";
import { logger } from '../configuration/logger';
import { DiscordRule } from "../dynamodb-libs/db-types";


export async function createRuleForGuild(guild: Guild, selectedRoleId: string, tokenAddress: string, minBalance: number, maxBalance: number, ruleid : string) {
    const responseRule: dynamoQueryResponse = await addSubItem("guild", { "guild-id": guild.id }, "Rules", "RuleSet", ruleid, {
        "id": ruleid,
        "roleId": selectedRoleId,
        "tokenAddress": tokenAddress,
        "minBalance": minBalance,
        "maxBalance": maxBalance,
    });
    if (responseRule.response) {
        logger.info(`Added new rule: ${ruleid}`);
    }
}

export async function getRulesForGuild(guild: BaseGuild): Promise<DiscordRule[]> {
    const rulesSnapshot: dynamoQueryResponse = await getItem("guild", { "guild-id": guild.id });
    if(rulesSnapshot.response) {
        return rulesSnapshot.data.Rules;
    } else {
        return null;
    }
    
}

export async function getRuleForGuild(guild: Guild, id: string): Promise<DiscordRule> {
    const ruleSnapshot: dynamoQueryResponse = await getSubItem("guild", { "guild-id": guild.id }, "Rules", id);
    return ruleSnapshot.data;
}

export async function deleteRuleForGuild(guild: Guild, id: string): Promise<DiscordRule> {
    const deleteResponse: dynamoQueryResponse = await deleteSubItem("guild", { "guild-id": guild.id }, "Rules", "RuleSet", id);
    return deleteResponse.data;
}
