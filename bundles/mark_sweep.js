(function () {
    'use strict';

    (function() {
        const env = {};
        try {
            if (process) {
                process.env = Object.assign({}, process.env);
                Object.assign(process.env, env);
                return;
            }
        } catch (e) {} // avoid ReferenceError: process is not defined
        globalThis.process = { env:env };
    })();

    var COMMAND={FLIP:"Flip",PUSH:"Push",POP:"Pop",COPY:"Copy",ASSIGN:"Assign",NEW:"New",SCAN:"Scan"};

    var ROW=10;var COLUMN=32;var NODE_SIZE=0;var MEMORY_SIZE=-99;var memory;var memoryHeaps=[];var commandHeap=[];var memoryMatrix;var tags;var typeTag;var flips=[];var TAG_SLOT=0;var SIZE_SLOT=1;var FIRST_CHILD_SLOT=2;var LAST_CHILD_SLOT=3;var MARKED=1;var UNMARKED=0;var ROOTS=[];function generateMemory(){memoryMatrix=[];for(var i=0;i<ROW;i+=1){memory=[];for(var j=0;j<COLUMN&&i*COLUMN+j<MEMORY_SIZE;j+=1){memory.push(i*COLUMN+j);}memoryMatrix.push(memory);}var obj={type:"init",heap:[],left:-1,right:-1,sizeLeft:0,sizeRight:0,desc:"Memory initially empty.",leftDesc:"",rightDesc:"",queue:[]};commandHeap.push(obj);}function updateRoots(array){for(var i=0;i<array.length;i+=1){ROOTS.push(array[i]);}}function initialize_memory(memorySize,nodeSize,marked,unmarked){MEMORY_SIZE=memorySize;NODE_SIZE=nodeSize;var excess=MEMORY_SIZE%NODE_SIZE;MEMORY_SIZE-=excess;ROW=MEMORY_SIZE/COLUMN;MARKED=marked;UNMARKED=unmarked;generateMemory();}function initialize_tag(allTag,types){tags=allTag;typeTag=types;}function allHeap(newHeap){memoryHeaps=newHeap;}function updateFlip(){flips.push(commandHeap.length-1);}function newCommand(type,left,right,sizeLeft,sizeRight,heap,description,firstDesc,lastDesc,queue){if(queue===void 0){queue=[];}var newType=type;var newLeft=left;var newRight=right;var newSizeLeft=sizeLeft;var newSizeRight=sizeRight;var newDesc=description;var newFirstDesc=firstDesc;var newLastDesc=lastDesc;memory=[];for(var j=0;j<heap.length;j+=1){memory.push(heap[j]);}var newQueue=[];for(var j=0;j<queue.length;j+=1){newQueue.push(queue[j]);}var obj={type:newType,heap:memory,left:newLeft,right:newRight,sizeLeft:newSizeLeft,sizeRight:newSizeRight,desc:newDesc,leftDesc:newFirstDesc,rightDesc:newLastDesc,queue:newQueue};commandHeap.push(obj);}function newSweep(left,heap){var newSizeLeft=NODE_SIZE;var desc="Freeing node "+left;newCommand("SWEEP",left,-1,newSizeLeft,0,heap,desc,"freed node","");}function newMark(left,heap,queue){var newSizeLeft=NODE_SIZE;var desc="Marking node "+left+" to be live memory";newCommand("MARK",left,-1,newSizeLeft,0,heap,desc,"marked node","",queue);}function addRoots(arr){for(var i=0;i<arr.length;i+=1){ROOTS.push(arr[i]);}}function showRoot(heap){var desc="All root nodes are marked";newCommand("Marked Roots",-1,-1,0,0,heap,desc,"","");}function showRoots(heap){for(var i=0;i<ROOTS.length;i+=1){showRoot(heap);}ROOTS=[];}function newUpdateSweep(right,heap){var desc="Set node "+right+" to freelist";newCommand("SWEEP RESET",-1,right,0,NODE_SIZE,heap,desc,"free node","");}function newPush(left,right,heap){var desc="Push OS update memory "+left+" and "+right+".";newCommand(COMMAND.PUSH,left,right,1,1,heap,desc,"last child address slot","new child pushed");}function newPop(res,left,right,heap){var newRes=res;var desc="Pop OS from memory "+left+", with value "+newRes+".";newCommand(COMMAND.POP,left,right,1,1,heap,desc,"popped memory","last child address slot");}function newAssign(res,left,heap){var newRes=res;var desc="Assign memory ["+left+"] with "+newRes+".";newCommand(COMMAND.ASSIGN,left,-1,1,1,heap,desc,"assigned memory","");}function newNew(left,heap){var newSizeLeft=NODE_SIZE;var desc="New node starts in ["+left+"].";newCommand(COMMAND.NEW,left,-1,newSizeLeft,0,heap,desc,"new memory allocated","");}function newGC(heap){var desc="Memory exhausted, start Mark and Sweep Algorithm";newCommand("Mark and Sweep Start",-1,-1,0,0,heap,desc,"","");updateFlip();}function endGC(heap){var desc="Result of free memory";newCommand("End of Garbage Collector",-1,-1,0,0,heap,desc,"","");updateFlip();}function updateSlotSegment(tag,size,first,last){if(tag>=0){TAG_SLOT=tag;}if(size>=0){SIZE_SLOT=size;}if(first>=0){FIRST_CHILD_SLOT=first;}if(last>=0){LAST_CHILD_SLOT=last;}}function get_memory_size(){return MEMORY_SIZE}function get_tags(){return tags}function get_command(){return commandHeap}function get_flips(){return flips}function get_types(){return typeTag}function get_memory_heap(){return memoryHeaps}function get_memory_matrix(){return memoryMatrix}function get_roots(){return ROOTS}function get_slots(){return [TAG_SLOT,SIZE_SLOT,FIRST_CHILD_SLOT,LAST_CHILD_SLOT]}function get_column_size(){return COLUMN}function get_row_size(){return ROW}function get_unmarked(){return UNMARKED}function get_marked(){return MARKED}function init(){return {toReplString:function(){return "<GC REDACTED>"},get_memory_size:get_memory_size,get_memory_heap:get_memory_heap,get_tags:get_tags,get_types:get_types,get_column_size:get_column_size,get_row_size:get_row_size,get_memory_matrix:get_memory_matrix,get_flips:get_flips,get_slots:get_slots,get_command:get_command,get_unmarked:get_unmarked,get_marked:get_marked,get_roots:get_roots}}function mark_sweep(){return {init:init,initialize_memory:initialize_memory,initialize_tag:initialize_tag,generateMemory:generateMemory,allHeap:allHeap,updateSlotSegment:updateSlotSegment,newCommand:newCommand,newMark:newMark,newPush:newPush,newPop:newPop,newAssign:newAssign,newNew:newNew,newGC:newGC,newSweep:newSweep,updateRoots:updateRoots,newUpdateSweep:newUpdateSweep,showRoots:showRoots,endGC:endGC,addRoots:addRoots,showRoot:showRoot}}

    return mark_sweep;

}());
