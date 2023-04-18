import { RPC } from '@ckb-lumos/rpc';
import AdmZip from 'adm-zip';
import download from 'download';

async function downloadCKB(version: string, persistPath?: string) {
  // TODO: download exists
  const zipBuffer = await download(
    `https://github.com/nervosnetwork/ckb/releases/download/${version}/ckb_${version}_aarch64-apple-darwin-portable.zip`,
    {},
  );
  const zip = new AdmZip(zipBuffer);
  zip.extractAllTo(persistPath || '/tmp/ckb', true);
}

async function prepareCKBBinary(version: string, persistPath?: string) {
  // detect binary exists
  // if has binary, return.
  // else download binary
  await downloadCKB(version, persistPath);
  // clone https://github.com/homura/ckb-dev/tree/main/devnet/ckb as net config
}

type CKBNodeOptions = {
  version?: string;
  persistPath?: string;
  port?: number;
  clean?: boolean;
};

export class CKBNode {
  options: CKBNodeOptions;
  constructor(options: CKBNodeOptions) {
    this.options = options;
  }

  /**
   * init CKB node
   * @returns {Promise<string[]>} return the issued cell in genesis block
   */
  async init(): Promise<string[]> {
    const { version = 'v0.108.1', persistPath } = this.options;
    await prepareCKBBinary(version, persistPath);
    return []; // return private keys
  }

  async launch(): Promise<RPC> {
    // detect default port is used
    // lock ckb binary
    // spawn ckb process
    return new RPC(`http://localhost:${this.options.port || 8114}`);
  }

  async stop(): Promise<void> {
    // kill ckb process
    if (this.options.clean) {
      // remove data and config dir
    }
  }
}
