export const ConfigFlags = {
    ThreadLinksFilter: 1 << 0, // 1
    AntiLinkFilter: 1 << 1, // 2
    BadBotsFilter: 1 << 2, // 4
    BadMemberFilter: 1 << 3, // 8
    MentionBot: 1 << 4, // 16
}; // For the moment these are the only config flags