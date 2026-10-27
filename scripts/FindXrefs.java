import ghidra.app.script.GhidraScript;
import ghidra.program.model.address.Address;
import ghidra.program.model.symbol.Reference;
import ghidra.program.model.symbol.ReferenceManager;
import ghidra.program.model.listing.Function;
import ghidra.program.model.listing.FunctionManager;

public class FindXrefs extends GhidraScript {
    public void run() throws Exception {
        Address addr = toAddr(0xa5244);
        println("Finding references to " + addr);
        
        FunctionManager fm = currentProgram.getFunctionManager();
        Function func = fm.getFunctionContaining(addr);
        if (func != null) {
            println("Function containing 0xa5244: " + func.getName() + " at " + func.getEntryPoint());
        }
        
        ReferenceManager refMgr = currentProgram.getReferenceManager();
        Reference[] refs = refMgr.getReferencesTo(addr);
        println("Number of references: " + refs.length);
        for (Reference ref : refs) {
            Address fromAddr = ref.getFromAddress();
            println("  from 0x" + fromAddr.toString() + " type=" + ref.getReferenceType());
            Function f = fm.getFunctionContaining(fromAddr);
            if (f != null) {
                println("    in function: " + f.getName() + " at " + f.getEntryPoint());
            }
        }
    }
}
