{
  description = "GleWorks static website development shell";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.11";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          config.allowUnfree = true;
        };
        
        # Node.js version for consistency
        nodejs = pkgs.nodejs_22;
        
      in {
        # Development shell
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            # Node.js toolchain
            nodejs
            
            # TypeScript tooling
            nodePackages.typescript-language-server
            
            # Docker for building images
            docker
            
            # Git
            git
            
            # Nix tooling
            nixd
            
          ];
          
          shellHook = ''
          # Fix Docker image timestamps (NixOS reproducibility issue)
          unset SOURCE_DATE_EPOCH
            # Ensure node_modules/.bin is in PATH
            export PATH="$PWD/node_modules/.bin:$PATH"
            
            echo "GleWorks: $(node --version), npm $(npm --version). Run npm ci to install dependencies."
          '';
        };
      }
    );
}
