# Atlassian/Jira MCP Setup and Fix Summary

## Goal
Connect Jira/Atlassian to the workspace through an MCP server so stories and board items can be fetched from Jira.

## Initial State
The workspace already had:
- Jira credentials configured in the environment file
- A VS Code MCP configuration file
- Playwright MCP configured, but no working Atlassian/Jira MCP server entry

## Problems Encountered

### 1. Invalid Atlassian MCP package name
The initial configuration used a package name that did not exist in the npm registry.

Error observed:
- `@atlassian/mcp-server-atlassian@latest is not in this registry.`

### 2. npm storage issue
The environment also failed during package download/startup because the system drive had insufficient free space.

Error observed:
- `ENOSPC: no space left on device`

### 3. MCP server startup issue
After changing the package name, the server still needed a working runtime configuration and environment variables to start successfully.

## Fixes Applied

### 1. Updated MCP configuration
The MCP server entry in `.vscode/mcp.json` was updated to use a published Atlassian MCP package:
- `@teolin/mcp-atlassian`

### 2. Wired Jira environment variables
The server configuration was updated to pass the Jira values through environment variables:
- `JIRA_URL`
- `JIRA_USER`
- `JIRA_API_TOKEN`

### 3. Fixed npm cache/temp storage
Because npm was failing due to low disk space, npm cache and temp directories were redirected to a drive with sufficient free space:
- `D:\npm-cache`
- `D:\npm-tmp`

### 4. Verified the server startup
The MCP server was tested using:

```powershell
npx -y @teolin/mcp-atlassian --help
```

Successful result:
- `Atlassian MCP server running on stdio`

## Jira Validation
Once the MCP server was working, Jira was queried successfully through the Jira REST API.

### Verified board
- SCRUM board

### Fetched issues
- `SCRUM-1` — Start here: Add your team's work
- `SCRUM-2` — Next: Connect your team's tools

## Summary
The Atlassian/Jira MCP integration was successfully wired by:
1. Replacing the invalid package name with a valid published one
2. Connecting Jira credentials through environment variables
3. Fixing npm storage issues caused by low disk space
4. Verifying the server startup and Jira access

## Notes for Future Use
If the MCP server fails again:
- verify the package name is correct
- verify npm cache/temp paths are writable
- restart VS Code or the MCP server after changing the configuration
- confirm the Jira credentials in the environment file are valid
