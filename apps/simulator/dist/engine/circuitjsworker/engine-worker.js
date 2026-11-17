(function(){
var $wnd=self,$doc=undefined,$gwt={},$stats=null,$sessionId=null;
var $moduleName='circuitjsworker',$moduleBase=new URL('.',self.location.href).href;
var $gwt_version='2.8.2',$strongName='649F160F79188A217425BD95978E647C';
var $intern_0 = {3:1, 9:1, 15:1}, $intern_1 = 4194303, $intern_2 = 1048575, $intern_3 = 4194304, $intern_4 = 17592186044416, $intern_5 = -17592186044416, $intern_6 = {3:1, 10:1}, $intern_7 = {8:1, 3:1}, $intern_8 = 0.48, $intern_9 = {4:1, 6:1}, $intern_10 = 6.283185307179586, $intern_11 = {49:1, 4:1, 6:1}, $intern_12 = {3:1}, $intern_13 = {4:1, 6:1, 24:1}, $intern_14 = 3.141592653589793, $intern_15 = 0.6366197723675814, $intern_16 = 1.5707963267948966, $intern_17 = 0.001, $intern_18 = {4:1, 6:1, 38:1, 20:1}, $intern_19 = 100000000, $intern_20 = {18:1, 4:1, 6:1}, $intern_21 = 0.01, $intern_22 = 38.662284941040014, $intern_23 = 0.025865, $intern_24 = {4:1, 26:1, 6:1}, $intern_25 = 1000000000000, $intern_26 = 1.7143528192808883E-7, $intern_27 = 1.0E-8, $intern_28 = 100000, $intern_29 = 1000000, $intern_30 = {4:1, 6:1, 37:1}, $intern_31 = 1000000000, $intern_32 = {4:1, 6:1, 77:1}, $intern_33 = 1.0E-4, $intern_34 = {4:1, 6:1, 51:1}, $intern_35 = 3.7E-4, $intern_36 = 0.0047, $intern_37 = -20.192307692307693, $intern_38 = {4:1, 6:1, 24:1, 87:1}, $intern_39 = {45:1}, $intern_40 = 15525485;
var _, prototypesByTypeId_0, initFnList_0, permutationId = -1;
function setGwtProperty(propertyName, propertyValue){
  typeof window === 'object' && typeof window['$gwt'] === 'object' && (window['$gwt'][propertyName] = propertyValue);
}

function gwtOnLoad_0(errFn, modName, modBase, softPermutationId){
  ensureModuleInit();
  var initFnList = initFnList_0;
  $moduleName = modName;
  $moduleBase = modBase;
  permutationId = softPermutationId;
  function initializeModules(){
    for (var i = 0; i < initFnList.length; i++) {
      initFnList[i]();
    }
  }

  if (errFn) {
    try {
      $entry(initializeModules)();
    }
     catch (e) {
      errFn(modName, e);
    }
  }
   else {
    $entry(initializeModules)();
  }
}

function ensureModuleInit(){
  initFnList_0 == null && (initFnList_0 = []);
}

function addInitFunctions(){
  ensureModuleInit();
  var initFnList = initFnList_0;
  for (var i = 0; i < arguments.length; i++) {
    initFnList.push(arguments[i]);
  }
}

function typeMarkerFn(){
}

function toString_2(object){
  var number;
  if (Array.isArray(object) && object.typeMarker === typeMarkerFn) {
    return $getName(getClass__Ljava_lang_Class___devirtual$(object)) + '@' + (number = hashCode__I__devirtual$(object) >>> 0 , number.toString(16));
  }
  return object.toString();
}

function portableObjCreate(obj){
  function F(){
  }

  ;
  F.prototype = obj || {};
  return new F;
}

function emptyMethod(){
}

function defineClass(typeId, superTypeIdOrPrototype, castableTypeMap){
  var prototypesByTypeId = prototypesByTypeId_0, superPrototype;
  var prototype_0 = prototypesByTypeId[typeId];
  var clazz = prototype_0 instanceof Array?prototype_0[0]:null;
  if (prototype_0 && !clazz) {
    _ = prototype_0;
  }
   else {
    _ = (superPrototype = superTypeIdOrPrototype && superTypeIdOrPrototype.prototype , !superPrototype && (superPrototype = prototypesByTypeId_0[superTypeIdOrPrototype]) , portableObjCreate(superPrototype));
    _.castableTypeMap = castableTypeMap;
    !superTypeIdOrPrototype && (_.typeMarker = typeMarkerFn);
    prototypesByTypeId[typeId] = _;
  }
  for (var i = 3; i < arguments.length; ++i) {
    arguments[i].prototype = _;
  }
  clazz && (_.___clazz = clazz);
}

function bootstrap(){
  prototypesByTypeId_0 = {};
  !Array.isArray && (Array.isArray = function(vArg){
    return Object.prototype.toString.call(vArg) === '[object Array]';
  }
  );
  function now_0(){
    return (new Date).getTime();
  }

  !Date.now && (Date.now = now_0);
}

bootstrap();
function Object_0(){
}

function equals_Ljava_lang_Object__Z__devirtual$(this$static, other){
  return instanceOfString(this$static)?$equals_0(this$static, other):instanceOfDouble(this$static)?(checkCriticalNotNull(this$static) , this$static === other):instanceOfBoolean(this$static)?(checkCriticalNotNull(this$static) , this$static === other):hasJavaObjectVirtualDispatch(this$static)?this$static.equals_0(other):isJavaArray(this$static)?this$static === other:!!this$static && !!this$static.equals?this$static.equals(other):maskUndefined(this$static) === maskUndefined(other);
}

function getClass__Ljava_lang_Class___devirtual$(this$static){
  return instanceOfString(this$static)?Ljava_lang_String_2_classLit:instanceOfDouble(this$static)?Ljava_lang_Double_2_classLit:instanceOfBoolean(this$static)?Ljava_lang_Boolean_2_classLit:hasJavaObjectVirtualDispatch(this$static)?this$static.___clazz:isJavaArray(this$static)?this$static.___clazz:this$static.___clazz || Array.isArray(this$static) && getClassLiteralForArray(Lcom_google_gwt_core_client_JavaScriptObject_2_classLit, 1) || Lcom_google_gwt_core_client_JavaScriptObject_2_classLit;
}

function hashCode__I__devirtual$(this$static){
  return instanceOfString(this$static)?getHashCode_0(this$static):instanceOfDouble(this$static)?round_int((checkCriticalNotNull(this$static) , this$static)):instanceOfBoolean(this$static)?(checkCriticalNotNull(this$static) , this$static)?1231:1237:hasJavaObjectVirtualDispatch(this$static)?this$static.hashCode_0():isJavaArray(this$static)?getHashCode(this$static):!!this$static && !!this$static.hashCode?this$static.hashCode():getHashCode(this$static);
}

defineClass(1, null, {}, Object_0);
_.equals_0 = function equals(other){
  return this === other;
}
;
_.getClass_0 = function getClass_0(){
  return this.___clazz;
}
;
_.hashCode_0 = function hashCode_0(){
  return getHashCode(this);
}
;
_.toString_0 = function toString_0(){
  var number;
  return $getName(getClass__Ljava_lang_Class___devirtual$(this)) + '@' + (number = hashCode__I__devirtual$(this) >>> 0 , number.toString(16));
}
;
_.equals = function(other){
  return this.equals_0(other);
}
;
_.hashCode = function(){
  return this.hashCode_0();
}
;
_.toString = function(){
  return this.toString_0();
}
;
function $ensureNamesAreInitialized(this$static){
  if (this$static.typeName != null) {
    return;
  }
  initializeNames(this$static);
}

function $getName(this$static){
  $ensureNamesAreInitialized(this$static);
  return this$static.typeName;
}

function $getSimpleName(this$static){
  $ensureNamesAreInitialized(this$static);
  return this$static.simpleName;
}

function Class(){
  ++nextSequentialId;
  this.typeName = null;
  this.simpleName = null;
  this.packageName = null;
  this.compoundName = null;
  this.canonicalName = null;
  this.typeId = null;
  this.arrayLiterals = null;
}

function createClassObject(packageName, compoundClassName){
  var clazz;
  clazz = new Class;
  clazz.packageName = packageName;
  clazz.compoundName = compoundClassName;
  return clazz;
}

function createForClass(packageName, compoundClassName, typeId){
  var clazz;
  clazz = createClassObject(packageName, compoundClassName);
  maybeSetClassLiteral(typeId, clazz);
  return clazz;
}

function createForPrimitive(className, primitiveTypeId){
  var clazz;
  clazz = createClassObject('', className);
  clazz.typeId = primitiveTypeId;
  clazz.modifiers = 1;
  return clazz;
}

function getClassLiteralForArray_0(leafClass, dimensions){
  var arrayLiterals = leafClass.arrayLiterals = leafClass.arrayLiterals || [];
  return arrayLiterals[dimensions] || (arrayLiterals[dimensions] = leafClass.createClassLiteralForArray(dimensions));
}

function getPrototypeForClass(clazz){
  if (clazz.isPrimitive()) {
    return null;
  }
  var typeId = clazz.typeId;
  return prototypesByTypeId_0[typeId];
}

function initializeNames(clazz){
  if (clazz.isArray_0()) {
    var componentType = clazz.componentType;
    componentType.isPrimitive()?(clazz.typeName = '[' + componentType.typeId):!componentType.isArray_0()?(clazz.typeName = '[L' + componentType.getName() + ';'):(clazz.typeName = '[' + componentType.getName());
    clazz.canonicalName = componentType.getCanonicalName() + '[]';
    clazz.simpleName = componentType.getSimpleName() + '[]';
    return;
  }
  var packageName = clazz.packageName;
  var compoundName = clazz.compoundName;
  compoundName = compoundName.split('/');
  clazz.typeName = join_0('.', [packageName, join_0('$', compoundName)]);
  clazz.canonicalName = join_0('.', [packageName, join_0('.', compoundName)]);
  clazz.simpleName = compoundName[compoundName.length - 1];
}

function join_0(separator, strings){
  var i = 0;
  while (!strings[i] || strings[i] == '') {
    i++;
  }
  var result = strings[i++];
  for (; i < strings.length; i++) {
    if (!strings[i] || strings[i] == '') {
      continue;
    }
    result += separator + strings[i];
  }
  return result;
}

function maybeSetClassLiteral(typeId, clazz){
  var proto;
  if (!typeId) {
    return;
  }
  clazz.typeId = typeId;
  var prototype_0 = getPrototypeForClass(clazz);
  if (!prototype_0) {
    prototypesByTypeId_0[typeId] = [clazz];
    return;
  }
  prototype_0.___clazz = clazz;
}

defineClass(120, 1, {}, Class);
_.createClassLiteralForArray = function createClassLiteralForArray(dimensions){
  var clazz;
  clazz = new Class;
  clazz.modifiers = 4;
  dimensions > 1?(clazz.componentType = getClassLiteralForArray_0(this, dimensions - 1)):(clazz.componentType = this);
  return clazz;
}
;
_.getCanonicalName = function getCanonicalName(){
  $ensureNamesAreInitialized(this);
  return this.canonicalName;
}
;
_.getName = function getName(){
  return $getName(this);
}
;
_.getSimpleName = function getSimpleName(){
  return $getSimpleName(this);
}
;
_.isArray_0 = function isArray(){
  return (this.modifiers & 4) != 0;
}
;
_.isPrimitive = function isPrimitive(){
  return (this.modifiers & 1) != 0;
}
;
_.toString_0 = function toString_7(){
  return ((this.modifiers & 2) != 0?'interface ':(this.modifiers & 1) != 0?'':'class ') + ($ensureNamesAreInitialized(this) , this.typeName);
}
;
_.modifiers = 0;
var nextSequentialId = 1;
var Ljava_lang_Object_2_classLit = createForClass('java.lang', 'Object', 1);
var Ljava_lang_Class_2_classLit = createForClass('java.lang', 'Class', 120);
function $fillInStackTrace(this$static){
  this$static.writetableStackTrace && this$static.backingJsObject !== '__noinit__' && this$static.initializeBackingError();
  return this$static;
}

function $setBackingJsObject(this$static, backingJsObject){
  this$static.backingJsObject = backingJsObject;
  backingJsObject != null && setPropertySafe(backingJsObject, '__java$exception', this$static);
}

function $toString(this$static, message){
  var className;
  className = $getName(this$static.___clazz);
  return message == null?className:className + ': ' + message;
}

function fixIE(e){
  if (!('stack' in e)) {
    try {
      throw e;
    }
     catch (ignored) {
    }
  }
  return e;
}

defineClass(15, 1, {3:1, 15:1});
_.createError = function createError(msg){
  return new Error(msg);
}
;
_.getMessage = function getMessage(){
  return this.detailMessage;
}
;
_.initializeBackingError = function initializeBackingError(){
  var className, errorMessage, message;
  message = this.detailMessage == null?null:this.detailMessage.replace(new RegExp('\n', 'g'), ' ');
  errorMessage = (className = $getName(this.___clazz) , message == null?className:className + ': ' + message);
  $setBackingJsObject(this, fixIE(this.createError(errorMessage)));
  captureStackTrace(this);
}
;
_.toString_0 = function toString_1(){
  return $toString(this, this.getMessage());
}
;
_.backingJsObject = '__noinit__';
_.writetableStackTrace = true;
var Ljava_lang_Throwable_2_classLit = createForClass('java.lang', 'Throwable', 15);
defineClass(9, 15, $intern_0);
var Ljava_lang_Exception_2_classLit = createForClass('java.lang', 'Exception', 9);
function RuntimeException(){
  $fillInStackTrace(this);
  this.initializeBackingError();
}

function RuntimeException_0(message){
  this.detailMessage = message;
  $fillInStackTrace(this);
  this.initializeBackingError();
}

defineClass(25, 9, $intern_0);
var Ljava_lang_RuntimeException_2_classLit = createForClass('java.lang', 'RuntimeException', 25);
defineClass(108, 25, $intern_0);
var Ljava_lang_JsException_2_classLit = createForClass('java.lang', 'JsException', 108);
defineClass(150, 108, $intern_0);
var Lcom_google_gwt_core_client_impl_JavaScriptExceptionBase_2_classLit = createForClass('com.google.gwt.core.client.impl', 'JavaScriptExceptionBase', 150);
function $clinit_JavaScriptException(){
  $clinit_JavaScriptException = emptyMethod;
  NOT_SET = new Object_0;
}

function $ensureInit(this$static){
  var exception;
  if (this$static.message_0 == null) {
    exception = maskUndefined(this$static.e) === maskUndefined(NOT_SET)?null:this$static.e;
    this$static.name_0 = exception == null?'null':instanceOfJso(exception)?getExceptionName0(castToJso(exception)):instanceOfString(exception)?'String':$getName(getClass__Ljava_lang_Class___devirtual$(exception));
    this$static.description = this$static.description + ': ' + (instanceOfJso(exception)?getExceptionDescription0(castToJso(exception)):exception + '');
    this$static.message_0 = '(' + this$static.name_0 + ') ' + this$static.description;
  }
}

function JavaScriptException(e){
  $clinit_JavaScriptException();
  $fillInStackTrace(this);
  this.backingJsObject = e;
  e != null && setPropertySafe(e, '__java$exception', this);
  this.detailMessage = e == null?'null':toString_2(e);
  this.description = '';
  this.e = e;
  this.description = '';
}

function getExceptionDescription0(e){
  return e == null?null:e.message;
}

function getExceptionName0(e){
  return e == null?null:e.name;
}

defineClass(93, 150, {93:1, 3:1, 9:1, 15:1}, JavaScriptException);
_.getMessage = function getMessage_0(){
  $ensureInit(this);
  return this.message_0;
}
;
_.getThrown = function getThrown(){
  return maskUndefined(this.e) === maskUndefined(NOT_SET)?null:this.e;
}
;
var NOT_SET;
var Lcom_google_gwt_core_client_JavaScriptException_2_classLit = createForClass('com.google.gwt.core.client', 'JavaScriptException', 93);
var Lcom_google_gwt_core_client_JavaScriptObject_2_classLit = createForClass('com.google.gwt.core.client', 'JavaScriptObject$', 0);
function now_1(){
  if (Date.now) {
    return Date.now();
  }
  return (new Date).getTime();
}

defineClass(174, 1, {});
var Lcom_google_gwt_core_client_Scheduler_2_classLit = createForClass('com.google.gwt.core.client', 'Scheduler', 174);
function $clinit_Impl(){
  $clinit_Impl = emptyMethod;
  !!($clinit_StackTraceCreator() , collector);
}

function apply_0(jsFunction, thisObj, args){
  return jsFunction.apply(thisObj, args);
  var __0;
}

function enter(){
  var now_0;
  if (entryDepth != 0) {
    now_0 = now_1();
    if (now_0 - watchdogEntryDepthLastScheduled > 2000) {
      watchdogEntryDepthLastScheduled = now_0;
      watchdogEntryDepthTimerId = $wnd.setTimeout(watchdogEntryDepthRun, 10);
    }
  }
  if (entryDepth++ == 0) {
    $flushEntryCommands(($clinit_SchedulerImpl() , INSTANCE));
    return true;
  }
  return false;
}

function entry_0(jsFunction){
  $clinit_Impl();
  return function(){
    return entry0(jsFunction, this, arguments);
    var __0;
  }
  ;
}

function entry0(jsFunction, thisObj, args){
  var initialEntry;
  initialEntry = enter();
  try {
    return apply_0(jsFunction, thisObj, args);
  }
   finally {
    exit(initialEntry);
  }
}

function exit(initialEntry){
  initialEntry && $flushFinallyCommands(($clinit_SchedulerImpl() , INSTANCE));
  --entryDepth;
  if (initialEntry) {
    if (watchdogEntryDepthTimerId != -1) {
      watchdogEntryDepthCancel(watchdogEntryDepthTimerId);
      watchdogEntryDepthTimerId = -1;
    }
  }
}

function reportToBrowser(e){
  $clinit_Impl();
  $wnd.setTimeout(function(){
    throw e;
  }
  , 0);
}

function watchdogEntryDepthCancel(timerId){
  $wnd.clearTimeout(timerId);
}

function watchdogEntryDepthRun(){
  entryDepth != 0 && (entryDepth = 0);
  watchdogEntryDepthTimerId = -1;
}

var entryDepth = 0, watchdogEntryDepthLastScheduled = 0, watchdogEntryDepthTimerId = -1;
function $clinit_SchedulerImpl(){
  $clinit_SchedulerImpl = emptyMethod;
  INSTANCE = new SchedulerImpl;
}

function $flushEntryCommands(this$static){
  var oldQueue, rescheduled;
  if (this$static.entryCommands) {
    rescheduled = null;
    do {
      oldQueue = this$static.entryCommands;
      this$static.entryCommands = null;
      rescheduled = runScheduledTasks(oldQueue, rescheduled);
    }
     while (this$static.entryCommands);
    this$static.entryCommands = rescheduled;
  }
}

function $flushFinallyCommands(this$static){
  var oldQueue, rescheduled;
  if (this$static.finallyCommands) {
    rescheduled = null;
    do {
      oldQueue = this$static.finallyCommands;
      this$static.finallyCommands = null;
      rescheduled = runScheduledTasks(oldQueue, rescheduled);
    }
     while (this$static.finallyCommands);
    this$static.finallyCommands = rescheduled;
  }
}

function SchedulerImpl(){
}

function push_0(queue, task){
  !queue && (queue = []);
  queue[queue.length] = task;
  return queue;
}

function runScheduledTasks(tasks, rescheduled){
  var e, i, j, t;
  for (i = 0 , j = tasks.length; i < j; i++) {
    t = tasks[i];
    try {
      t[1]?t[0].$_nullMethod() && (rescheduled = push_0(rescheduled, t)):t[0].execute();
    }
     catch ($e0) {
      $e0 = toJava($e0);
      if (instanceOf($e0, 15)) {
        e = $e0;
        $clinit_Impl();
        reportToBrowser(instanceOf(e, 93)?castTo(e, 93).getThrown():e);
      }
       else 
        throw toJs($e0);
    }
  }
  return rescheduled;
}

defineClass(160, 174, {}, SchedulerImpl);
var INSTANCE;
var Lcom_google_gwt_core_client_impl_SchedulerImpl_2_classLit = createForClass('com.google.gwt.core.client.impl', 'SchedulerImpl', 160);
function $clinit_StackTraceCreator(){
  $clinit_StackTraceCreator = emptyMethod;
  var c, enforceLegacy;
  enforceLegacy = !supportsErrorStack();
  c = new StackTraceCreator$CollectorModernNoSourceMap;
  collector = enforceLegacy?new StackTraceCreator$CollectorLegacy:c;
}

function captureStackTrace(error){
  $clinit_StackTraceCreator();
  collector.collect(error);
}

function extractFunctionName(fnName){
  var fnRE = /function(?:\s+([\w$]+))?\s*\(/;
  var match_0 = fnRE.exec(fnName);
  return match_0 && match_0[1] || 'anonymous';
}

function supportsErrorStack(){
  if (Error.stackTraceLimit > 0) {
    $wnd.Error.stackTraceLimit = Error.stackTraceLimit = 64;
    return true;
  }
  return 'stack' in new Error;
}

var collector;
defineClass(186, 1, {});
var Lcom_google_gwt_core_client_impl_StackTraceCreator$Collector_2_classLit = createForClass('com.google.gwt.core.client.impl', 'StackTraceCreator/Collector', 186);
function StackTraceCreator$CollectorLegacy(){
}

defineClass(151, 186, {}, StackTraceCreator$CollectorLegacy);
_.collect = function collect(error){
  var seen = {}, name_1;
  var fnStack = [];
  error['fnStack'] = fnStack;
  var callee = arguments.callee.caller;
  while (callee) {
    var name_0 = ($clinit_StackTraceCreator() , callee.name || (callee.name = extractFunctionName(callee.toString())));
    fnStack.push(name_0);
    var keyName = ':' + name_0;
    var withThisName = seen[keyName];
    if (withThisName) {
      var i, j;
      for (i = 0 , j = withThisName.length; i < j; i++) {
        if (withThisName[i] === callee) {
          return;
        }
      }
    }
    (withThisName || (seen[keyName] = [])).push(callee);
    callee = callee.caller;
  }
}
;
var Lcom_google_gwt_core_client_impl_StackTraceCreator$CollectorLegacy_2_classLit = createForClass('com.google.gwt.core.client.impl', 'StackTraceCreator/CollectorLegacy', 151);
defineClass(187, 186, {});
_.collect = function collect_0(error){
}
;
var Lcom_google_gwt_core_client_impl_StackTraceCreator$CollectorModern_2_classLit = createForClass('com.google.gwt.core.client.impl', 'StackTraceCreator/CollectorModern', 187);
function StackTraceCreator$CollectorModernNoSourceMap(){
}

defineClass(152, 187, {}, StackTraceCreator$CollectorModernNoSourceMap);
var Lcom_google_gwt_core_client_impl_StackTraceCreator$CollectorModernNoSourceMap_2_classLit = createForClass('com.google.gwt.core.client.impl', 'StackTraceCreator/CollectorModernNoSourceMap', 152);
function canSet(array, value_0){
  var elementTypeCategory;
  switch (getElementTypeCategory(array)) {
    case 6:
      return instanceOfString(value_0);
    case 7:
      return instanceOfDouble(value_0);
    case 8:
      return instanceOfBoolean(value_0);
    case 3:
      return Array.isArray(value_0) && (elementTypeCategory = getElementTypeCategory(value_0) , !(elementTypeCategory >= 14 && elementTypeCategory <= 16));
    case 11:
      return value_0 != null && typeof value_0 === 'function';
    case 12:
      return value_0 != null && (typeof value_0 === 'object' || typeof value_0 == 'function');
    case 0:
      return canCast(value_0, array.__elementTypeId$);
    case 2:
      return isJsObjectOrFunction(value_0) && !(value_0.typeMarker === typeMarkerFn);
    case 1:
      return isJsObjectOrFunction(value_0) && !(value_0.typeMarker === typeMarkerFn) || canCast(value_0, array.__elementTypeId$);
    default:return true;
  }
}

function getClassLiteralForArray(clazz, dimensions){
  return getClassLiteralForArray_0(clazz, dimensions);
}

function getElementTypeCategory(array){
  return array.__elementTypeCategory$ == null?10:array.__elementTypeCategory$;
}

function initMultidimensionalArray(leafClassLiteral, castableTypeMapExprs, elementTypeIds, leafElementTypeCategory, dimExprs, count){
  return initMultidimensionalArray_0(leafClassLiteral, castableTypeMapExprs, elementTypeIds, leafElementTypeCategory, dimExprs, 0, count);
}

function initMultidimensionalArray_0(leafClassLiteral, castableTypeMapExprs, elementTypeIds, leafElementTypeCategory, dimExprs, index_0, count){
  var elementTypeCategory, i, isLastDimension, length_0, result;
  length_0 = dimExprs[index_0];
  isLastDimension = index_0 == count - 1;
  elementTypeCategory = isLastDimension?leafElementTypeCategory:0;
  result = initializeArrayElementsWithDefaults(elementTypeCategory, length_0);
  leafElementTypeCategory != 10 && stampJavaTypeInfo(getClassLiteralForArray(leafClassLiteral, count - index_0), castableTypeMapExprs[index_0], elementTypeIds[index_0], elementTypeCategory, result);
  if (!isLastDimension) {
    ++index_0;
    for (i = 0; i < length_0; ++i) {
      result[i] = initMultidimensionalArray_0(leafClassLiteral, castableTypeMapExprs, elementTypeIds, leafElementTypeCategory, dimExprs, index_0, count);
    }
  }
  return result;
}

function initUnidimensionalArray(leafClassLiteral, castableTypeMap, elementTypeId, length_0, elementTypeCategory, dimensions){
  var result;
  result = initializeArrayElementsWithDefaults(elementTypeCategory, length_0);
  elementTypeCategory != 10 && stampJavaTypeInfo(getClassLiteralForArray(leafClassLiteral, dimensions), castableTypeMap, elementTypeId, elementTypeCategory, result);
  return result;
}

function initializeArrayElementsWithDefaults(elementTypeCategory, length_0){
  var array = new Array(length_0);
  var initValue;
  switch (elementTypeCategory) {
    case 14:
    case 15:
      initValue = 0;
      break;
    case 16:
      initValue = false;
      break;
    default:return array;
  }
  for (var i = 0; i < length_0; ++i) {
    array[i] = initValue;
  }
  return array;
}

function isJavaArray(src_0){
  return Array.isArray(src_0) && src_0.typeMarker === typeMarkerFn;
}

function setCheck(array, index_0, value_0){
  checkCriticalArrayType(value_0 == null || canSet(array, value_0));
  return array[index_0] = value_0;
}

function stampJavaTypeInfo(arrayClass, castableTypeMap, elementTypeId, elementTypeCategory, array){
  array.___clazz = arrayClass;
  array.castableTypeMap = castableTypeMap;
  array.typeMarker = typeMarkerFn;
  array.__elementTypeId$ = elementTypeId;
  array.__elementTypeCategory$ = elementTypeCategory;
  return array;
}

function create(value_0){
  var a0, a1, a2;
  a0 = value_0 & $intern_1;
  a1 = value_0 >> 22 & $intern_1;
  a2 = value_0 < 0?$intern_2:0;
  return create0(a0, a1, a2);
}

function create0(l, m, h){
  return {l:l, m:m, h:h};
}

function toDoubleHelper(a){
  return a.l + a.m * $intern_3 + a.h * $intern_4;
}

function compare(a, b){
  var a0, a1, a2, b0, b1, b2, signA, signB;
  signA = a.h >> 19;
  signB = b.h >> 19;
  if (signA != signB) {
    return signB - signA;
  }
  a2 = a.h;
  b2 = b.h;
  if (a2 != b2) {
    return a2 - b2;
  }
  a1 = a.m;
  b1 = b.m;
  if (a1 != b1) {
    return a1 - b1;
  }
  a0 = a.l;
  b0 = b.l;
  return a0 - b0;
}

function fromDouble(value_0){
  var a0, a1, a2, negative, result, neg0, neg1, neg2;
  if (isNaN(value_0)) {
    return $clinit_BigLongLib$Const() , ZERO;
  }
  if (value_0 < -9223372036854775808) {
    return $clinit_BigLongLib$Const() , MIN_VALUE;
  }
  if (value_0 >= 9223372036854775807) {
    return $clinit_BigLongLib$Const() , MAX_VALUE;
  }
  negative = false;
  if (value_0 < 0) {
    negative = true;
    value_0 = -value_0;
  }
  a2 = 0;
  if (value_0 >= $intern_4) {
    a2 = round_int(value_0 / $intern_4);
    value_0 -= a2 * $intern_4;
  }
  a1 = 0;
  if (value_0 >= $intern_3) {
    a1 = round_int(value_0 / $intern_3);
    value_0 -= a1 * $intern_3;
  }
  a0 = round_int(value_0);
  result = create0(a0, a1, a2);
  negative && (neg0 = ~result.l + 1 & $intern_1 , neg1 = ~result.m + (neg0 == 0?1:0) & $intern_1 , neg2 = ~result.h + (neg0 == 0 && neg1 == 0?1:0) & $intern_2 , result.l = neg0 , result.m = neg1 , result.h = neg2 , undefined);
  return result;
}

function mul(a, b){
  var a0, a1, a2, a3, a4, b0, b1, b2, b3, b4, c0, c00, c01, c1, c10, c11, c12, c13, c2, c22, c23, c24, p0, p1, p2, p3, p4;
  a0 = a.l & 8191;
  a1 = a.l >> 13 | (a.m & 15) << 9;
  a2 = a.m >> 4 & 8191;
  a3 = a.m >> 17 | (a.h & 255) << 5;
  a4 = (a.h & 1048320) >> 8;
  b0 = b.l & 8191;
  b1 = b.l >> 13 | (b.m & 15) << 9;
  b2 = b.m >> 4 & 8191;
  b3 = b.m >> 17 | (b.h & 255) << 5;
  b4 = (b.h & 1048320) >> 8;
  p0 = a0 * b0;
  p1 = a1 * b0;
  p2 = a2 * b0;
  p3 = a3 * b0;
  p4 = a4 * b0;
  if (b1 != 0) {
    p1 += a0 * b1;
    p2 += a1 * b1;
    p3 += a2 * b1;
    p4 += a3 * b1;
  }
  if (b2 != 0) {
    p2 += a0 * b2;
    p3 += a1 * b2;
    p4 += a2 * b2;
  }
  if (b3 != 0) {
    p3 += a0 * b3;
    p4 += a1 * b3;
  }
  b4 != 0 && (p4 += a0 * b4);
  c00 = p0 & $intern_1;
  c01 = (p1 & 511) << 13;
  c0 = c00 + c01;
  c10 = p0 >> 22;
  c11 = p1 >> 9;
  c12 = (p2 & 262143) << 4;
  c13 = (p3 & 31) << 17;
  c1 = c10 + c11 + c12 + c13;
  c22 = p2 >> 18;
  c23 = p3 >> 5;
  c24 = (p4 & 4095) << 8;
  c2 = c22 + c23 + c24;
  c1 += c0 >> 22;
  c0 &= $intern_1;
  c2 += c1 >> 22;
  c1 &= $intern_1;
  c2 &= $intern_2;
  return create0(c0, c1, c2);
}

function sub_0(a, b){
  var sum0, sum1, sum2;
  sum0 = a.l - b.l;
  sum1 = a.m - b.m + (sum0 >> 22);
  sum2 = a.h - b.h + (sum1 >> 22);
  return create0(sum0 & $intern_1, sum1 & $intern_1, sum2 & $intern_2);
}

function toDouble(a){
  var neg0, neg1, neg2;
  if (compare(a, ($clinit_BigLongLib$Const() , ZERO)) < 0) {
    return -toDoubleHelper((neg0 = ~a.l + 1 & $intern_1 , neg1 = ~a.m + (neg0 == 0?1:0) & $intern_1 , neg2 = ~a.h + (neg0 == 0 && neg1 == 0?1:0) & $intern_2 , create0(neg0, neg1, neg2)));
  }
  return a.l + a.m * $intern_3 + a.h * $intern_4;
}

function $clinit_BigLongLib$Const(){
  $clinit_BigLongLib$Const = emptyMethod;
  MAX_VALUE = create0($intern_1, $intern_1, 524287);
  MIN_VALUE = create0(0, 0, 524288);
  create(1);
  create(2);
  ZERO = create(0);
}

var MAX_VALUE, MIN_VALUE, ZERO;
function canCast(src_0, dstId){
  if (instanceOfString(src_0)) {
    return !!stringCastMap[dstId];
  }
   else if (src_0.castableTypeMap) {
    return !!src_0.castableTypeMap[dstId];
  }
   else if (instanceOfDouble(src_0)) {
    return !!doubleCastMap[dstId];
  }
   else if (instanceOfBoolean(src_0)) {
    return !!booleanCastMap[dstId];
  }
  return false;
}

function castTo(src_0, dstId){
  checkCriticalType(src_0 == null || canCast(src_0, dstId));
  return src_0;
}

function castToArray(src_0){
  var elementTypeCategory;
  checkCriticalType(src_0 == null || Array.isArray(src_0) && (elementTypeCategory = getElementTypeCategory(src_0) , !(elementTypeCategory >= 14 && elementTypeCategory <= 16)));
  return src_0;
}

function castToJso(src_0){
  checkCriticalType(src_0 == null || isJsObjectOrFunction(src_0) && !(src_0.typeMarker === typeMarkerFn));
  return src_0;
}

function castToString(src_0){
  checkCriticalType(src_0 == null || instanceOfString(src_0));
  return src_0;
}

function charToString(x_0){
  return String.fromCharCode(x_0);
}

function hasJavaObjectVirtualDispatch(src_0){
  return !Array.isArray(src_0) && src_0.typeMarker === typeMarkerFn;
}

function instanceOf(src_0, dstId){
  return src_0 != null && canCast(src_0, dstId);
}

function instanceOfBoolean(src_0){
  return typeof src_0 === 'boolean';
}

function instanceOfDouble(src_0){
  return typeof src_0 === 'number';
}

function instanceOfJso(src_0){
  return src_0 != null && isJsObjectOrFunction(src_0) && !(src_0.typeMarker === typeMarkerFn);
}

function instanceOfString(src_0){
  return typeof src_0 === 'string';
}

function isJsObjectOrFunction(src_0){
  return typeof src_0 === 'object' || typeof src_0 === 'function';
}

function maskUndefined(src_0){
  return src_0 == null?null:src_0;
}

function round_int(x_0){
  return Math.max(Math.min(x_0, 2147483647), -2147483648) | 0;
}

var booleanCastMap, doubleCastMap, stringCastMap;
function toJava(e){
  var javaException;
  if (instanceOf(e, 15)) {
    return e;
  }
  javaException = e && e['__java$exception'];
  if (!javaException) {
    javaException = new JavaScriptException(e);
    captureStackTrace(javaException);
  }
  return javaException;
}

function toJs(t){
  return t.backingJsObject;
}

function compare_0(a, b){
  var result;
  if (isSmallLong0(a) && isSmallLong0(b)) {
    result = a - b;
    if (!isNaN(result)) {
      return result;
    }
  }
  return compare(isSmallLong0(a)?toBigLong(a):a, isSmallLong0(b)?toBigLong(b):b);
}

function createLongEmul(big_0){
  var a2;
  a2 = big_0.h;
  if (a2 == 0) {
    return big_0.l + big_0.m * $intern_3;
  }
  if (a2 == $intern_2) {
    return big_0.l + big_0.m * $intern_3 - $intern_4;
  }
  return big_0;
}

function fromDouble_0(value_0){
  if ($intern_5 < value_0 && value_0 < $intern_4) {
    return value_0 < 0?$wnd.Math.ceil(value_0):$wnd.Math.floor(value_0);
  }
  return createLongEmul(fromDouble(value_0));
}

function gt(a, b){
  return compare_0(a, b) > 0;
}

function gte(a, b){
  return compare_0(a, b) >= 0;
}

function isSmallLong0(value_0){
  return typeof value_0 === 'number';
}

function mul_0(a, b){
  var result;
  if (isSmallLong0(a) && isSmallLong0(b)) {
    result = a * b;
    if ($intern_5 < result && result < $intern_4) {
      return result;
    }
  }
  return createLongEmul(mul(isSmallLong0(a)?toBigLong(a):a, isSmallLong0(b)?toBigLong(b):b));
}

function sub_1(a, b){
  var result;
  if (isSmallLong0(a) && isSmallLong0(b)) {
    result = a - b;
    if ($intern_5 < result && result < $intern_4) {
      return result;
    }
  }
  return createLongEmul(sub_0(isSmallLong0(a)?toBigLong(a):a, isSmallLong0(b)?toBigLong(b):b));
}

function toBigLong(longValue){
  var a0, a1, a3, value_0;
  value_0 = longValue;
  a3 = 0;
  if (value_0 < 0) {
    value_0 += $intern_4;
    a3 = $intern_2;
  }
  a1 = round_int(value_0 / $intern_3);
  a0 = round_int(value_0 - a1 * $intern_3);
  return create0(a0, a1, a3);
}

function toDouble_0(a){
  var d;
  if (isSmallLong0(a)) {
    d = a;
    return d == -0.?0:d;
  }
  return toDouble(a);
}

function init(){
  $onModuleLoad(new EngineEntryPoint);
}

function $adjustBbox(this$static, x1, y1, x2, y2){
  var q;
  if (x1 > x2) {
    q = x1;
    x1 = x2;
    x2 = q;
  }
  if (y1 > y2) {
    q = y1;
    y1 = y2;
    y2 = q;
  }
  x1 = min_1(this$static.boundingBox.x_0, x1);
  y1 = min_1(this$static.boundingBox.y_0, y1);
  x2 = max_1(this$static.boundingBox.x_0 + this$static.boundingBox.width_0, x2);
  y2 = max_1(this$static.boundingBox.y_0 + this$static.boundingBox.height, y2);
  $setBounds(this$static.boundingBox, x1, y1, x2 - x1, y2 - y1);
}

function $adjustLeadsToGrid(this$static, flipX, flipY){
  var adjx, adjy, cx, cy, roundx, roundy;
  cx = (this$static.point1.x_0 + this$static.point2.x_0) / 2 | 0;
  cy = (this$static.point1.y_0 + this$static.point2.y_0) / 2 | 0;
  roundx = flipX?1:-1;
  roundy = flipY?1:-1;
  adjx = $snapGrid_0(app, cx + roundx) - cx;
  adjy = $snapGrid_0(app, cy + roundy) - cy;
  $move(this$static.lead1, adjx, adjy);
  $move(this$static.lead2, adjx, adjy);
}

function $allocNodes(this$static){
  var n;
  n = this$static.getPostCount() + this$static.getInternalNodeCount();
  if (this$static.nodes == null || this$static.nodes.length != n) {
    this$static.nodes = initUnidimensionalArray(Lcom_lushprojects_circuitjs1_client_CircuitNode_2_classLit, $intern_6, 33, n, 0, 1);
    this$static.volts = initUnidimensionalArray(D_classLit, $intern_7, 5, n, 15, 1);
  }
}

function $calcArrow(a, b, al, aw){
  var adx, ady, l, p1, p2, poly;
  poly = new Polygon;
  p1 = new Point;
  p2 = new Point;
  adx = b.x_0 - a.x_0;
  ady = b.y_0 - a.y_0;
  l = $wnd.Math.sqrt(adx * adx + ady * ady);
  $addPoint(poly, b.x_0, b.y_0);
  $interpPoint2(a, b, p1, p2, 1 - al / l, aw);
  $addPoint(poly, p1.x_0, p1.y_0);
  $addPoint(poly, p2.x_0, p2.y_0);
  return poly;
}

function $calcLeads(this$static, len){
  if (this$static.dn < len || len == 0) {
    this$static.lead1 = this$static.point1;
    this$static.lead2 = this$static.point2;
    return;
  }
  this$static.lead1 = $interpPoint(this$static.point1, this$static.point2, (this$static.dn - len) / (2 * this$static.dn));
  this$static.lead2 = $interpPoint(this$static.point1, this$static.point2, (this$static.dn + len) / (2 * this$static.dn));
}

function $comparePair(x1, x2, y1, y2){
  return x1 == y1 && x2 == y2 || x1 == y2 && x2 == y1;
}

function $createPolygon(a, b, c){
  var p;
  p = new Polygon;
  $addPoint(p, a.x_0, a.y_0);
  $addPoint(p, b.x_0, b.y_0);
  $addPoint(p, c.x_0, c.y_0);
  return p;
}

function $createPolygon_0(a, b, c, d){
  var p;
  p = new Polygon;
  $addPoint(p, a.x_0, a.y_0);
  $addPoint(p, b.x_0, b.y_0);
  $addPoint(p, c.x_0, c.y_0);
  $addPoint(p, d.x_0, d.y_0);
  return p;
}

function $createPolygon_1(a){
  var i, p;
  p = new Polygon;
  for (i = 0; i != a.length; i++)
    $addPoint(p, a[i].x_0, a[i].y_0);
  return p;
}

function $getNode(this$static, n){
  return this$static.nodes[n];
}

function $getNodeAtPoint(this$static, pt){
  var i;
  for (i = 0; i != this$static.getPostCount(); i++) {
    if ($equals(this$static.getPost(i), pt))
      return i;
  }
  return 0;
}

function $getSchmittPolygon(this$static, gsize, ctr){
  var h1, h2, hs, len, pts;
  pts = $newPointArray(6);
  hs = 3 * gsize;
  h1 = 3 * gsize;
  h2 = h1 * 2;
  len = distance(this$static.lead1, this$static.lead2);
  pts[0] = $interpPoint_0(this$static.lead1, this$static.lead2, ctr - h2 / len, hs);
  pts[1] = $interpPoint_0(this$static.lead1, this$static.lead2, ctr + h1 / len, hs);
  pts[2] = $interpPoint_0(this$static.lead1, this$static.lead2, ctr + h1 / len, -hs);
  pts[3] = $interpPoint_0(this$static.lead1, this$static.lead2, ctr + h2 / len, -hs);
  pts[4] = $interpPoint_0(this$static.lead1, this$static.lead2, ctr - h1 / len, -hs);
  pts[5] = $interpPoint_0(this$static.lead1, this$static.lead2, ctr - h1 / len, hs);
  return $createPolygon_1(pts);
}

function $interpPoint(a, b, f){
  var p;
  p = new Point;
  p.x_0 = round_int($wnd.Math.floor(a.x_0 * (1 - f) + b.x_0 * f + $intern_8));
  p.y_0 = round_int($wnd.Math.floor(a.y_0 * (1 - f) + b.y_0 * f + $intern_8));
  return p;
}

function $interpPoint_0(a, b, f, g){
  var p;
  p = new Point;
  $interpPoint_2(a, b, p, f, g);
  return p;
}

function $interpPoint_1(a, b, c, f){
  c.x_0 = round_int($wnd.Math.floor(a.x_0 * (1 - f) + b.x_0 * f + $intern_8));
  c.y_0 = round_int($wnd.Math.floor(a.y_0 * (1 - f) + b.y_0 * f + $intern_8));
}

function $interpPoint_2(a, b, c, f, g){
  var gx, gy;
  gx = b.y_0 - a.y_0;
  gy = a.x_0 - b.x_0;
  g /= $wnd.Math.sqrt(gx * gx + gy * gy);
  c.x_0 = round_int($wnd.Math.floor(a.x_0 * (1 - f) + b.x_0 * f + g * gx + $intern_8));
  c.y_0 = round_int($wnd.Math.floor(a.y_0 * (1 - f) + b.y_0 * f + g * gy + $intern_8));
}

function $interpPoint2(a, b, c, d, f, g){
  var gx, gy;
  gx = b.y_0 - a.y_0;
  gy = a.x_0 - b.x_0;
  g /= $wnd.Math.sqrt(gx * gx + gy * gy);
  c.x_0 = round_int($wnd.Math.floor(a.x_0 * (1 - f) + b.x_0 * f + g * gx + $intern_8));
  c.y_0 = round_int($wnd.Math.floor(a.y_0 * (1 - f) + b.y_0 * f + g * gy + $intern_8));
  d.x_0 = round_int($wnd.Math.floor(a.x_0 * (1 - f) + b.x_0 * f - g * gx + $intern_8));
  d.y_0 = round_int($wnd.Math.floor(a.y_0 * (1 - f) + b.y_0 * f - g * gy + $intern_8));
}

function $newPointArray(n){
  var a;
  a = initUnidimensionalArray(Lcom_lushprojects_circuitjs1_client_Point_2_classLit, $intern_6, 11, n, 0, 1);
  while (n > 0)
    a[--n] = new Point;
  return a;
}

function $reset(this$static){
  var i;
  for (i = 0; i != this$static.getPostCount() + this$static.getInternalNodeCount(); i++)
    this$static.volts[i] = 0;
}

function $setBbox(this$static, x1, y1, x2, y2){
  var q;
  if (x1 > x2) {
    q = x1;
    x1 = x2;
    x2 = q;
  }
  if (y1 > y2) {
    q = y1;
    y1 = y2;
    y2 = q;
  }
  $setBounds(this$static.boundingBox, x1, y1, x2 - x1 + 1, y2 - y1 + 1);
}

function $setBbox_0(this$static, p1, p2, w){
  var dpx, dpy;
  $setBbox(this$static, p1.x_0, p1.y_0, p2.x_0, p2.y_0);
  dpx = round_int(this$static.dpx1 * w);
  dpy = round_int(this$static.dpy1 * w);
  $adjustBbox(this$static, p1.x_0 + dpx, p1.y_0 + dpy, p1.x_0 - dpx, p1.y_0 - dpy);
}

function $setPoints(this$static){
  this$static.dx = this$static.x2 - this$static.x_0;
  this$static.dy = this$static.y2 - this$static.y_0;
  this$static.dn = $wnd.Math.sqrt(this$static.dx * this$static.dx + this$static.dy * this$static.dy);
  this$static.dpx1 = this$static.dy / this$static.dn;
  this$static.dpy1 = -this$static.dx / this$static.dn;
  this$static.dsign = this$static.dy == 0?sign(this$static.dx):sign(this$static.dy);
  this$static.point1 = new Point_0(this$static.x_0, this$static.y_0);
  this$static.point2 = new Point_0(this$static.x2, this$static.y2);
}

function $snapGrid(z_0){
  return $snapGrid_0(app, z_0);
}

function $validateRailNode(this$static, n){
  var fpi;
  fpi = new FindPathInfo(2, this$static, this$static.nodes[n], sim);
  if ($findPath(fpi, ground)) {
    $stop(sim, 'Path to ground with no resistance!');
    return false;
  }
  return true;
}

function CircuitElm(xa, ya, xb, yb, f){
  this.x_0 = xa;
  this.y_0 = ya;
  this.x2 = xb;
  this.y2 = yb;
  this.flags = f;
  $allocNodes(this);
  this.initBoundingBox();
}

function abs_0(x_0){
  return x_0 < 0?-x_0:x_0;
}

function distance(p1, p2){
  var x_0, y_0;
  x_0 = p1.x_0 - p2.x_0;
  y_0 = p1.y_0 - p2.y_0;
  return $wnd.Math.sqrt(x_0 * x_0 + y_0 * y_0);
}

function initSimulationClass(app_, sim_){
  sim = sim_;
  app = app_;
  new Point;
  new Point;
}

function max_1(a, b){
  return a > b?a:b;
}

function min_1(a, b){
  return a < b?a:b;
}

function sign(x_0){
  return x_0 < 0?-1:x_0 == 0?0:1;
}

defineClass(4, 1, $intern_9);
_.calculateCurrent = function calculateCurrent(){
}
;
_.doStep = function doStep(){
}
;
_.getBusWidth = function getBusWidth(){
  return 1;
}
;
_.getConnectedPost = function getConnectedPost(){
  return this.point2;
}
;
_.getConnectedPost_0 = function getConnectedPost_0(n){
  return this.getConnectedPost();
}
;
_.getConnection = function getConnection(n1, n2){
  return true;
}
;
_.getCurrent = function getCurrent(){
  return this.current_1;
}
;
_.getCurrentIntoNode = function getCurrentIntoNode(n){
  return n == 0 && this.getPostCount() == 2?-this.current_1:this.current_1;
}
;
_.getDumpType = function getDumpType(){
  return 0;
}
;
_.getInternalNodeCount = function getInternalNodeCount(){
  return 0;
}
;
_.getMatrixConnection = function getMatrixConnection(n1, n2){
  return this.getConnection(n1, n2);
}
;
_.getPost = function getPost(n){
  return n == 0?this.point1:n == 1?this.point2:null;
}
;
_.getPostCount = function getPostCount(){
  return 2;
}
;
_.getPostWidth = function getPostWidth(n){
  return 1;
}
;
_.getVoltageDiff = function getVoltageDiff(){
  return this.volts[0] - this.volts[1];
}
;
_.getVoltageSourceCount = function getVoltageSourceCount(){
  return 0;
}
;
_.getWireSegments = function getWireSegments(list){
  var b, bw, ep0, ep1, p0, p1;
  bw = this.getBusWidth();
  for (b = 0; b < bw; b++) {
    p0 = this.getPost(b);
    p1 = this.getConnectedPost_0(b);
    ep0 = p0.x_0 + ',' + p0.y_0 + ',' + p0.z_0;
    ep1 = !!p1 && !$equals(p1, p0)?p1.x_0 + ',' + p1.y_0 + ',' + p1.z_0:null;
    $add_2(list, new SimulationManager$WireSegment(this, b, ep0, ep1));
  }
}
;
_.hasGroundConnection = function hasGroundConnection(n1){
  return false;
}
;
_.initBoundingBox = function initBoundingBox(){
  this.boundingBox = new Rectangle;
  $setBounds(this.boundingBox, min_1(this.x_0, this.x2), min_1(this.y_0, this.y2), abs_0(this.x2 - this.x_0) + 1, abs_0(this.y2 - this.y_0) + 1);
}
;
_.isIdealCapacitor = function isIdealCapacitor(){
  return false;
}
;
_.isRemovableWire = function isRemovableWire(){
  return false;
}
;
_.isWireEquivalent = function isWireEquivalent(){
  return false;
}
;
_.nonLinear_0 = function nonLinear(){
  return false;
}
;
_.reset_0 = function reset_0(){
  $reset(this);
}
;
_.setCurrent = function setCurrent(vs, c){
  this.current_1 = c;
}
;
_.setNode = function setNode(p, n){
  this.nodes[p] = n;
}
;
_.setNodeVoltage = function setNodeVoltage(n, c){
  this.volts[n] = c;
  this.calculateCurrent();
}
;
_.setPoints = function setPoints(){
  $setPoints(this);
}
;
_.setVoltageSource = function setVoltageSource(n, v){
  this.voltSource_0 = v;
}
;
_.setWireCurrent = function setWireCurrent(bit, c){
  this.current_1 = c;
}
;
_.stamp = function stamp(){
}
;
_.startIteration = function startIteration(){
}
;
_.stepFinished = function stepFinished(){
}
;
_.validate = function validate(){
  return true;
}
;
_.current_1 = 0;
_.dn = 0;
_.dpx1 = 0;
_.dpy1 = 0;
_.dsign = 0;
_.dx = 0;
_.dy = 0;
_.flags = 0;
_.inComposite = false;
_.x_0 = 0;
_.x2 = 0;
_.y_0 = 0;
_.y2 = 0;
var app, sim;
var Lcom_lushprojects_circuitjs1_client_CircuitElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'CircuitElm', 4);
function AMElm(xa, ya, xb, yb, f, st){
  CircuitElm.call(this, xa, ya, xb, yb, f);
  this.carrierfreq = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.signalfreq = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.maxVoltage = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  (this.flags & 2) != 0 && (this.flags &= -3);
  this.freqTimeZero = 0;
}

defineClass(95, 4, {95:1, 4:1, 6:1}, AMElm);
_.doStep = function doStep_0(){
  var w;
  $updateVoltageSource(this.voltSource_0, (w = $intern_10 * (sim.t - this.freqTimeZero) , ($wnd.Math.sin(w * this.signalfreq) + 1) / 2 * $wnd.Math.sin(w * this.carrierfreq) * this.maxVoltage));
}
;
_.getDumpType = function getDumpType_0(){
  return 200;
}
;
_.getPostCount = function getPostCount_0(){
  return 1;
}
;
_.getVoltageDiff = function getVoltageDiff_0(){
  return this.volts[0];
}
;
_.getVoltageSourceCount = function getVoltageSourceCount_0(){
  return 1;
}
;
_.hasGroundConnection = function hasGroundConnection_0(n1){
  return true;
}
;
_.reset_0 = function reset_1(){
  this.freqTimeZero = 0;
}
;
_.setPoints = function setPoints_0(){
  $setPoints(this);
  this.lead1 = $interpPoint(this.point1, this.point2, 1 - 17 / this.dn);
}
;
_.stamp = function stamp_0(){
  $stampVoltageSource(ground, this.nodes[0], this.voltSource_0);
}
;
_.validate = function validate_0(){
  return $validateRailNode(this, 0);
}
;
_.carrierfreq = 0;
_.freqTimeZero = 0;
_.maxVoltage = 0;
_.signalfreq = 0;
var Lcom_lushprojects_circuitjs1_client_AMElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'AMElm', 95);
function AmmeterElm(xa, ya, xb, yb, st){
  CircuitElm.call(this, xa, ya, xb, yb, 3);
  this.zerocount = 0;
  this.rmsI = 0;
  this.maxI = 0;
  this.minI = 0;
  this.increasingI = true;
  this.decreasingI = true;
  this.meter = __parseAndValidateInt($nextToken(st), 10);
  try {
    __parseAndValidateInt($nextToken(st), 10);
  }
   catch ($e0) {
    $e0 = toJava($e0);
    if (!instanceOf($e0, 9))
      throw toJs($e0);
  }
}

defineClass(62, 4, {62:1, 4:1, 6:1}, AmmeterElm);
_.getDumpType = function getDumpType_1(){
  return 370;
}
;
_.getVoltageDiff = function getVoltageDiff_1(){
  return this.volts[0];
}
;
_.getVoltageSourceCount = function getVoltageSourceCount_1(){
  return 1;
}
;
_.isWireEquivalent = function isWireEquivalent_0(){
  return true;
}
;
_.setPoints = function setPoints_1(){
  $setPoints(this);
  this.mid = $interpPoint(this.point1, this.point2, 0.6);
  $interpPoint(this.point1, this.point2, 0.5);
  $calcArrow(this.point1, this.mid, 14, 7);
}
;
_.setVoltageSource = function setVoltageSource_0(n, v){
  this.voltSource_0 = v;
  $setNodes(v, this.nodes[0], this.nodes[1]);
}
;
_.stamp = function stamp_1(){
  $stampVoltageSource_0(this.nodes[0], this.nodes[1], this.voltSource_0, 0);
}
;
_.stepFinished = function stepFinished_0(){
  ++this.count;
  this.total += this.current_1 * this.current_1;
  if (this.current_1 > this.maxI && this.increasingI) {
    this.maxI = this.current_1;
    this.increasingI = true;
    this.decreasingI = false;
  }
  if (this.current_1 < this.maxI && this.increasingI) {
    this.minI = this.current_1;
    this.increasingI = false;
    this.decreasingI = true;
    this.total = this.total / this.count;
    this.rmsI = $wnd.Math.sqrt(this.total);
    isNaN(this.rmsI) && (this.rmsI = 0);
    this.count = 0;
    this.total = 0;
  }
  if (this.current_1 < this.minI && this.decreasingI) {
    this.minI = this.current_1;
    this.increasingI = false;
    this.decreasingI = true;
  }
  if (this.current_1 > this.minI && this.decreasingI) {
    this.maxI = this.current_1;
    this.increasingI = true;
    this.decreasingI = false;
    this.total = this.total / this.count;
    this.rmsI = $wnd.Math.sqrt(this.total);
    isNaN(this.rmsI) && (this.rmsI = 0);
    this.count = 0;
    this.total = 0;
  }
  if (this.current_1 == 0) {
    ++this.zerocount;
    if (this.zerocount > 5) {
      this.total = 0;
      this.rmsI = 0;
      this.maxI = 0;
      this.minI = 0;
    }
  }
   else {
    this.zerocount = 0;
  }
}
;
_.count = 0;
_.decreasingI = false;
_.increasingI = false;
_.maxI = 0;
_.meter = 0;
_.minI = 0;
_.rmsI = 0;
_.total = 0;
_.zerocount = 0;
var Lcom_lushprojects_circuitjs1_client_AmmeterElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'AmmeterElm', 62);
function $setPoints_0(this$static){
  $setPoints(this$static);
  $calcLeads(this$static, 32);
  $adjustLeadsToGrid(this$static, (this$static.flags & 4) != 0, (this$static.flags & 8) != 0);
  new Point;
  this$static.openhs = (this$static.flags & 4) != 0 != ((this$static.flags & 8) != 0) != ((this$static.flags & 16) != 0)?-16:16;
  this$static.point3 = $interpPoint_0(this$static.lead1, this$static.lead2, 0.5, -this$static.openhs);
  $interpPoint_0(this$static.lead1, this$static.lead2, 0.5, -this$static.openhs / 2 | 0);
}

function AnalogSwitchElm(xa, ya, xb, yb, f, st){
  CircuitElm.call(this, xa, ya, xb, yb, f);
  this.r_on = 20;
  this.r_off = 10000000000;
  this.threshold = 2.5;
  try {
    this.r_on = $doubleValue(__parseAndValidateDouble($nextToken(st)));
    this.r_off = $doubleValue(__parseAndValidateDouble($nextToken(st)));
    this.threshold = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  }
   catch ($e0) {
    $e0 = toJava($e0);
    if (!instanceOf($e0, 9))
      throw toJs($e0);
  }
}

defineClass(49, 4, $intern_11, AnalogSwitchElm);
_.calculateCurrent = function calculateCurrent_0(){
  if (this.resistance == 0)
    return;
  (this.flags & 2) != 0 && this.open_0?(this.current_1 = 0):(this.current_1 = (this.volts[0] - this.volts[1]) / this.resistance);
}
;
_.doStep = function doStep_1(){
  this.open_0 = this.volts[2] < this.threshold;
  (this.flags & 1) != 0 && (this.open_0 = !this.open_0);
  if (!((this.flags & 2) != 0 && this.open_0)) {
    this.resistance = this.open_0?this.r_off:this.r_on;
    $stampResistor(this.nodes[0], this.nodes[1], this.resistance);
  }
}
;
_.getConnection = function getConnection_0(n1, n2){
  if (n1 == 2 || n2 == 2)
    return false;
  return true;
}
;
_.getCurrentIntoNode = function getCurrentIntoNode_0(n){
  if (n == 2)
    return 0;
  if (n == 0)
    return -this.current_1;
  return this.current_1;
}
;
_.getDumpType = function getDumpType_2(){
  return 159;
}
;
_.getPost = function getPost_0(n){
  return n == 0?this.point1:n == 1?this.point2:this.point3;
}
;
_.getPostCount = function getPostCount_1(){
  return 3;
}
;
_.hasGroundConnection = function hasGroundConnection_1(n1){
  return (this.flags & 2) != 0 && n1 < 2;
}
;
_.nonLinear_0 = function nonLinear_0(){
  return true;
}
;
_.setPoints = function setPoints_2(){
  $setPoints_0(this);
}
;
_.stamp = function stamp_2(){
  if ((this.flags & 2) != 0) {
    $stampResistor(this.nodes[0], ground, this.r_off);
    $stampResistor(this.nodes[1], ground, this.r_off);
  }
}
;
_.open_0 = false;
_.openhs = 0;
_.r_off = 0;
_.r_on = 0;
_.resistance = 0;
_.threshold = 0;
var Lcom_lushprojects_circuitjs1_client_AnalogSwitchElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'AnalogSwitchElm', 49);
function AnalogSwitch2Elm(xa, ya, xb, yb, f, st){
  AnalogSwitchElm.call(this, xa, ya, xb, yb, f, st);
}

defineClass(137, 49, $intern_11, AnalogSwitch2Elm);
_.calculateCurrent = function calculateCurrent_1(){
  this.open_0?(this.current_1 = (this.volts[0] - this.volts[2]) / this.r_on):(this.current_1 = (this.volts[0] - this.volts[1]) / this.r_on);
}
;
_.doStep = function doStep_2(){
  this.open_0 = this.volts[3] < this.threshold;
  (this.flags & 1) != 0 && (this.open_0 = !this.open_0);
  if (this.open_0) {
    $stampResistor(this.nodes[0], this.nodes[2], this.r_on);
    (this.flags & 2) != 0 || $stampResistor(this.nodes[0], this.nodes[1], this.r_off);
  }
   else {
    $stampResistor(this.nodes[0], this.nodes[1], this.r_on);
    (this.flags & 2) != 0 || $stampResistor(this.nodes[0], this.nodes[2], this.r_off);
  }
}
;
_.getConnection = function getConnection_1(n1, n2){
  if (n1 == 3 || n2 == 3)
    return false;
  if ((this.flags & 2) != 0)
    return $comparePair(n1, n2, 0, this.open_0?2:1);
  return true;
}
;
_.getCurrentIntoNode = function getCurrentIntoNode_1(n){
  var position;
  if (n == 0)
    return -this.current_1;
  position = this.open_0?1:0;
  if (n == position + 1)
    return this.current_1;
  return 0;
}
;
_.getDumpType = function getDumpType_3(){
  return 160;
}
;
_.getMatrixConnection = function getMatrixConnection_0(n1, n2){
  return n1 != 3 && n2 != 3;
}
;
_.getPost = function getPost_1(n){
  return n == 0?this.point1:n == 3?this.ctlPoint:this.swposts[n - 1];
}
;
_.getPostCount = function getPostCount_2(){
  return 4;
}
;
_.hasGroundConnection = function hasGroundConnection_2(n){
  return (this.flags & 2) != 0 && n != 3;
}
;
_.setPoints = function setPoints_3(){
  $setPoints_0(this);
  $calcLeads(this, 32);
  $adjustLeadsToGrid(this, (this.flags & 4) != 0, (this.flags & 8) != 0);
  this.swposts = $newPointArray(2);
  this.swpoles = $newPointArray(2);
  $interpPoint2(this.lead1, this.lead2, this.swpoles[0], this.swpoles[1], 1, this.openhs);
  $interpPoint2(this.point1, this.point2, this.swposts[0], this.swposts[1], 1, this.openhs);
  this.ctlPoint = $interpPoint_0(this.lead1, this.lead2, 0.5, this.openhs);
}
;
_.stamp = function stamp_3(){
  if ((this.flags & 2) != 0) {
    $stampResistor(this.nodes[1], ground, this.r_off);
    $stampResistor(this.nodes[2], ground, this.r_off);
  }
}
;
var Lcom_lushprojects_circuitjs1_client_AnalogSwitch2Elm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'AnalogSwitch2Elm', 137);
function $getInput(this$static, x_0){
  var high, res;
  high = (this$static.flags & 4) == 0;
  if ((this$static.flags & 2) == 0)
    return this$static.volts[x_0] > this$static.highVoltage * 0.5?high:!high;
  res = this$static.volts[x_0] > this$static.highVoltage * (this$static.inputStates[x_0]?0.35:0.55);
  this$static.inputStates[x_0] = res;
  return res?high:!high;
}

function $setPoints_1(this$static){
  var adj, hs, i, i0;
  $setPoints(this$static);
  this$static.inputStates = initUnidimensionalArray(Z_classLit, $intern_12, 5, this$static.inputCount, 16, 1);
  hs = this$static.gheight;
  this$static.ww = this$static.gwidth2;
  this$static.ww > this$static.dn / 2 && (this$static.ww = round_int(this$static.dn / 2));
  this$static.isInverting() && this$static.ww + 8 > this$static.dn / 2 && (this$static.ww = round_int(this$static.dn / 2 - 8));
  $calcLeads(this$static, this$static.ww * 2);
  this$static.inPosts = initUnidimensionalArray(Lcom_lushprojects_circuitjs1_client_Point_2_classLit, $intern_6, 11, this$static.inputCount, 0, 1);
  this$static.inGates = initUnidimensionalArray(Lcom_lushprojects_circuitjs1_client_Point_2_classLit, $intern_6, 11, this$static.inputCount, 0, 1);
  i0 = -this$static.inputCount / 2 | 0;
  (this$static.flags & 4) != 0?(this$static.icircles = initUnidimensionalArray(Lcom_lushprojects_circuitjs1_client_Point_2_classLit, $intern_6, 11, this$static.inputCount, 0, 1)):(this$static.icircles = null);
  for (i = 0; i != this$static.inputCount; ++i , i0++) {
    i0 == 0 && (this$static.inputCount & 1) == 0 && ++i0;
    adj = this$static.getLeadAdjustment(i);
    this$static.inPosts[i] = $interpPoint_0(this$static.point1, this$static.point2, 0, hs * i0);
    this$static.inGates[i] = $interpPoint_0(this$static.lead1, this$static.lead2, this$static.icircles != null?-8 / (this$static.ww * 2) + adj:adj, hs * i0);
    this$static.icircles != null && (this$static.icircles[i] = $interpPoint_0(this$static.lead1, this$static.lead2, -4 / (this$static.ww * 2), hs * i0));
  }
  this$static.hs2 = this$static.gwidth * ((this$static.inputCount / 2 | 0) + 1);
  $setBbox_0(this$static, this$static.point1, this$static.point2, this$static.hs2);
  (this$static.flags & 2) != 0 && $getSchmittPolygon(this$static, this$static.gsize, 0.4699999988079071);
}

function $setupVolts(this$static){
  var i;
  for (i = 0; i != this$static.inputCount; i++)
    this$static.volts[i] = this$static.lastOutput ^ this$static.isInverting()?this$static.highVoltage:0;
}

function GateElm(xa, ya, xb, yb, f, st){
  var lastOutputVoltage;
  CircuitElm.call(this, xa, ya, xb, yb, f);
  this.inputCount = 2;
  this.inputCount = (new Integer_0($nextToken(st))).value_0;
  lastOutputVoltage = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.highVoltage = 5;
  try {
    this.highVoltage = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  }
   catch ($e0) {
    $e0 = toJava($e0);
    if (!instanceOf($e0, 9))
      throw toJs($e0);
  }
  this.lastOutput = lastOutputVoltage > this.highVoltage * 0.5;
  this.gsize = (f & 1) != 0?1:2;
  this.gwidth = 7 * ((f & 1) != 0?1:2);
  this.gwidth2 = 14 * ((f & 1) != 0?1:2);
  this.gheight = 8 * ((f & 1) != 0?1:2);
  this.flags &= -2;
  this.flags |= ((f & 1) != 0?1:2) == 1?1:0;
  $allocNodes(this);
  $setupVolts(this);
}

defineClass(24, 4, $intern_13);
_.doStep = function doStep_3(){
  var f, res;
  f = this.calcFunction();
  this.isInverting() && (f = !f);
  if (this.propagationDelay == 0 && this.lastTime != sim.t) {
    if (this.lastOutput == !f) {
      if (this.oscillationCount++ > 50) {
        this.oscillationCount = 0;
        $getrand(app, 10) > 5 && (f = this.lastOutput);
      }
    }
     else 
      this.oscillationCount = 0;
    this.lastTime = sim.t;
  }
  if (this.propagationDelay > 0) {
    if (f != this.lastOutput) {
      if (this.delayEndTime == 0)
        this.delayEndTime = sim.t + this.propagationDelay;
      else if (sim.t >= this.delayEndTime) {
        this.lastOutput = f;
        this.delayEndTime = 0;
      }
    }
     else {
      this.delayEndTime = 0;
    }
  }
   else {
    this.lastOutput = f;
  }
  res = this.lastOutput?this.highVoltage:0;
  $updateVoltageSource(this.voltSource_0, res);
}
;
_.getConnection = function getConnection_2(n1, n2){
  return false;
}
;
_.getCurrentIntoNode = function getCurrentIntoNode_2(n){
  if (n == this.inputCount)
    return this.current_1;
  return 0;
}
;
_.getLeadAdjustment = function getLeadAdjustment(ix){
  return 0;
}
;
_.getPost = function getPost_2(n){
  if (n == this.inputCount)
    return this.point2;
  return this.inPosts[n];
}
;
_.getPostCount = function getPostCount_3(){
  return this.inputCount + 1;
}
;
_.getVoltageSourceCount = function getVoltageSourceCount_2(){
  return 1;
}
;
_.hasGroundConnection = function hasGroundConnection_3(n1){
  return n1 == this.inputCount;
}
;
_.isInverting = function isInverting(){
  return false;
}
;
_.setPoints = function setPoints_4(){
  $setPoints_1(this);
}
;
_.stamp = function stamp_4(){
  $stampVoltageSource(ground, this.nodes[this.inputCount], this.voltSource_0);
}
;
_.validate = function validate_1(){
  return $validateRailNode(this, this.inputCount);
}
;
_.delayEndTime = 0;
_.gheight = 0;
_.gsize = 0;
_.gwidth = 0;
_.gwidth2 = 0;
_.highVoltage = 0;
_.hs2 = 0;
_.inputCount = 0;
_.lastOutput = false;
_.lastTime = 0;
_.oscillationCount = 0;
_.propagationDelay = 0;
_.ww = 0;
var Lcom_lushprojects_circuitjs1_client_GateElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'GateElm', 24);
function AndGateElm(xa, ya, xb, yb, f, st){
  GateElm.call(this, xa, ya, xb, yb, f, st);
}

defineClass(119, 24, $intern_13, AndGateElm);
_.calcFunction = function calcFunction(){
  var f, i;
  f = true;
  for (i = 0; i != this.inputCount; i++)
    f = f & $getInput(this, i);
  return f;
}
;
_.getDumpType = function getDumpType_4(){
  return 150;
}
;
_.setPoints = function setPoints_5(){
  var triPoints;
  $setPoints_1(this);
  triPoints = $newPointArray(5);
  $interpPoint2(this.lead1, this.lead2, triPoints[0], triPoints[4], 0, this.hs2);
  $interpPoint2(this.lead1, this.lead2, triPoints[1], triPoints[3], 0.5, this.hs2);
  $interpPoint_1(this.lead1, this.lead2, triPoints[2], 0.5);
  $createPolygon_1(triPoints);
  if (this.isInverting()) {
    $interpPoint(this.point1, this.point2, 0.5 + (this.ww + 4) / this.dn);
    this.lead2 = $interpPoint(this.point1, this.point2, 0.5 + (this.ww + 8) / this.dn);
  }
}
;
var Lcom_lushprojects_circuitjs1_client_AndGateElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'AndGateElm', 119);
function $triangleFunc(x_0){
  if (x_0 < $intern_14)
    return x_0 * $intern_15 - 1;
  return 1 - (x_0 - $intern_14) * $intern_15;
}

function VoltageElm(xa, ya, xb, yb, f, st){
  CircuitElm.call(this, xa, ya, xb, yb, f);
  this.maxVoltage = 5;
  this.frequency = 40;
  this.waveform = 0;
  this.dutyCycle = 0.5;
  try {
    this.waveform = (new Integer_0($nextToken(st))).value_0;
    this.frequency = $doubleValue(__parseAndValidateDouble($nextToken(st)));
    this.maxVoltage = $doubleValue(__parseAndValidateDouble($nextToken(st)));
    this.bias = $doubleValue(__parseAndValidateDouble($nextToken(st)));
    this.phaseShift = $doubleValue(__parseAndValidateDouble($nextToken(st)));
    this.dutyCycle = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  }
   catch ($e0) {
    $e0 = toJava($e0);
    if (!instanceOf($e0, 9))
      throw toJs($e0);
  }
  if ((this.flags & 2) != 0) {
    this.flags &= -3;
    this.phaseShift = $intern_16;
  }
  (this.flags & 4) == 0 && this.waveform == 5 && (this.dutyCycle = 0.15915494309189535);
  this.freqTimeZero = 0;
}

defineClass(20, 4, {4:1, 6:1, 20:1}, VoltageElm);
_.doStep = function doStep_4(){
  this.waveform != 0 && $updateVoltageSource(this.voltSource_0, this.getVoltage());
}
;
_.getDumpType = function getDumpType_5(){
  return 118;
}
;
_.getInternalNodeCount = function getInternalNodeCount_0(){
  return this.internalResistance > 0?1:0;
}
;
_.getVoltage = function getVoltage(){
  var dutyPhase, halfRise, risePhase, t, w, wm;
  if (this.waveform != 0 && app.dcAnalysisFlag)
    return this.bias;
  w = $intern_10 * (sim.t - this.freqTimeZero) * this.frequency + this.phaseShift;
  switch (this.waveform) {
    case 0:
      return this.maxVoltage + this.bias;
    case 1:
      return $wnd.Math.sin(w) * this.maxVoltage + this.bias;
    case 2:
      {
        wm = w % $intern_10;
        dutyPhase = $intern_10 * this.dutyCycle;
        if (this.riseTime > 0) {
          risePhase = this.riseTime * this.frequency * 2 * $intern_14;
          halfRise = risePhase / 2;
          if (wm < halfRise) {
            t = (wm + halfRise) / risePhase;
            return this.bias + this.maxVoltage * (2 * t - 1);
          }
           else if (wm < dutyPhase - halfRise)
            return this.bias + this.maxVoltage;
          else if (wm < dutyPhase + halfRise) {
            t = (wm - dutyPhase + halfRise) / risePhase;
            return this.bias + this.maxVoltage * (1 - 2 * t);
          }
           else if (wm < $intern_10 - halfRise)
            return this.bias - this.maxVoltage;
          else {
            t = (wm - ($intern_10 - halfRise)) / risePhase;
            return this.bias + this.maxVoltage * (2 * t - 1);
          }
        }
        return this.bias + (wm > dutyPhase?-this.maxVoltage:this.maxVoltage);
      }

    case 3:
      return this.bias + $triangleFunc(w % $intern_10) * this.maxVoltage;
    case 4:
      return this.bias + w % $intern_10 * (this.maxVoltage / $intern_14) - this.maxVoltage;
    case 5:
      {
        wm = w % $intern_10;
        dutyPhase = $intern_10 * this.dutyCycle;
        if (this.riseTime > 0) {
          risePhase = this.riseTime * this.frequency * 2 * $intern_14;
          halfRise = risePhase / 2;
          if (wm < halfRise) {
            t = (wm + halfRise) / risePhase;
            return this.bias + this.maxVoltage * t;
          }
           else if (wm < dutyPhase - halfRise)
            return this.bias + this.maxVoltage;
          else if (wm < dutyPhase + halfRise) {
            t = (wm - dutyPhase + halfRise) / risePhase;
            return this.bias + this.maxVoltage * (1 - t);
          }
           else if (wm < $intern_10 - halfRise)
            return this.bias;
          else {
            t = (wm - ($intern_10 - halfRise)) / risePhase;
            return this.bias + this.maxVoltage * t;
          }
        }
        return wm < dutyPhase?this.maxVoltage + this.bias:this.bias;
      }

    case 6:
      return this.noiseValue;
    default:return 0;
  }
}
;
_.getVoltageDiff = function getVoltageDiff_2(){
  return this.volts[1] - this.volts[0];
}
;
_.getVoltageSourceCount = function getVoltageSourceCount_3(){
  return 1;
}
;
_.reset_0 = function reset_2(){
  this.freqTimeZero = 0;
}
;
_.setPoints = function setPoints_6(){
  $setPoints(this);
  this.waveform == 0 && (this.flags & 8) != 0?$calcLeads(this, 34):$calcLeads(this, this.waveform == 0 || this.waveform == 7?8:34);
}
;
_.setVoltageSource = function setVoltageSource_1(n, v){
  this.voltSource_0 = v;
  this.internalResistance > 0?$setNodes(v, this.nodes[0], this.nodes[2]):$setNodes(v, this.nodes[0], this.nodes[1]);
}
;
_.stamp = function stamp_5(){
  var vsNode2;
  vsNode2 = this.internalResistance > 0?this.nodes[2]:this.nodes[1];
  this.waveform == 0?$stampVoltageSource_0(this.nodes[0], vsNode2, this.voltSource_0, this.getVoltage()):$stampVoltageSource(this.nodes[0], vsNode2, this.voltSource_0);
  this.internalResistance > 0 && $stampResistor(this.nodes[2], this.nodes[1], this.internalResistance);
}
;
_.stepFinished = function stepFinished_1(){
  this.waveform == 6 && (this.noiseValue = ($nextDouble(app.random) * 2 - 1) * this.maxVoltage + this.bias);
}
;
_.validate = function validate_2(){
  var fpi;
  if (this.internalResistance > 0)
    return true;
  if (this.getPostCount() == 2) {
    fpi = new FindPathInfo(2, this, this.nodes[1], sim);
    if ($findPath(fpi, this.nodes[0])) {
      this.internalResistance = $intern_17;
      return false;
    }
  }
  return true;
}
;
_.bias = 0;
_.dutyCycle = 0;
_.freqTimeZero = 0;
_.frequency = 0;
_.internalResistance = 0;
_.maxVoltage = 0;
_.noiseValue = 0;
_.phaseShift = 0;
_.riseTime = 0;
_.waveform = 0;
var Lcom_lushprojects_circuitjs1_client_VoltageElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'VoltageElm', 20);
function $validateRailNode_0(this$static){
  var fpi;
  fpi = new FindPathInfo(2, this$static, this$static.nodes[0], sim);
  if ($findPath(fpi, ground)) {
    this$static.internalResistance = $intern_17;
    return false;
  }
  return true;
}

function RailElm(xa, ya, xb, yb, f, st){
  VoltageElm.call(this, xa, ya, xb, yb, f, st);
}

defineClass(38, 20, $intern_18, RailElm);
_.doStep = function doStep_5(){
  this.waveform != 0 && $updateVoltageSource(this.voltSource_0, this.getVoltage());
}
;
_.getDumpType = function getDumpType_6(){
  return 82;
}
;
_.getPostCount = function getPostCount_4(){
  return 1;
}
;
_.getVoltageDiff = function getVoltageDiff_3(){
  return this.volts[0];
}
;
_.hasGroundConnection = function hasGroundConnection_4(n1){
  return true;
}
;
_.setPoints = function setPoints_7(){
  $setPoints(this);
  this.waveform == 0 && (this.flags & 8) != 0?$calcLeads(this, 34):$calcLeads(this, this.waveform == 0 || this.waveform == 7?8:34);
  this.lead1 = $interpPoint(this.point1, this.point2, 1 - 17 / this.dn);
}
;
_.setVoltageSource = function setVoltageSource_2(n, v){
  this.voltSource_0 = v;
  this.internalResistance > 0?$setNodes(v, this.nodes[0], this.nodes[2]):$setNodes(v, this.nodes[0], this.nodes[1]);
  this.internalResistance > 0?$setNodes(v, ground, this.nodes[1]):$setNodes(v, ground, this.nodes[0]);
}
;
_.stamp = function stamp_6(){
  var vsNode;
  vsNode = this.internalResistance > 0?this.nodes[1]:this.nodes[0];
  this.waveform == 0?$stampVoltageSource_0(ground, vsNode, this.voltSource_0, this.getVoltage()):$stampVoltageSource(ground, vsNode, this.voltSource_0);
  this.internalResistance > 0 && $stampResistor(this.nodes[1], this.nodes[0], this.internalResistance);
}
;
_.validate = function validate_3(){
  return this.internalResistance > 0 || $validateRailNode_0(this);
}
;
var Lcom_lushprojects_circuitjs1_client_RailElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'RailElm', 38);
function AntennaElm(xa, ya, xb, yb, f, st){
  RailElm.call(this, xa, ya, xb, yb, f, st);
  this.waveform = 1;
}

defineClass(165, 38, $intern_18, AntennaElm);
_.getDumpType = function getDumpType_7(){
  return 65;
}
;
_.getVoltage = function getVoltage_0(){
  var fm;
  fm = 3 * $wnd.Math.sin(this.fmphase);
  return $wnd.Math.sin($intern_10 * sim.t * 3000) * (1.3 + $wnd.Math.sin($intern_10 * sim.t * 12)) * 3 + $wnd.Math.sin($intern_10 * sim.t * 2710) * (1.3 + $wnd.Math.sin($intern_10 * sim.t * 13)) * 3 + $wnd.Math.sin($intern_10 * sim.t * 2433) * (1.3 + $wnd.Math.sin($intern_10 * sim.t * 14)) * 3 + fm;
}
;
_.stepFinished = function stepFinished_2(){
  this.fmphase += $intern_10 * (2200 + $wnd.Math.sin($intern_10 * sim.t * 13) * 100) * sim.timeStep_0;
}
;
_.fmphase = 0;
var Lcom_lushprojects_circuitjs1_client_AntennaElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'AntennaElm', 165);
function $reset_0(this$static){
  this$static.dataPtr = 0;
  this$static.dataFull = false;
  this$static.dataSampleCount = 0;
  this$static.nextDataSample = 0;
  this$static.dataSample = 0;
}

function AudioOutputElm(xa, ya, xb, yb, st){
  CircuitElm.call(this, xa, ya, xb, yb, 0);
  this.dataSampleCount = 0;
  this.nextDataSample = 0;
  this.duration = __parseAndValidateDouble($nextToken(st));
  this.samplingRate = __parseAndValidateInt($nextToken(st), 10);
  __parseAndValidateInt($nextToken(st), 10);
  this.dataCount = round_int(this.samplingRate * this.duration);
  this.data_0 = initUnidimensionalArray(D_classLit, $intern_7, 5, this.dataCount, 15, 1);
  this.dataStart = sim.t;
  this.dataPtr = 0;
  this.dataFull = false;
  this.sampleStep = 1 / this.samplingRate;
  this.nextDataSample = sim.t + this.sampleStep;
}

defineClass(28, 4, {28:1, 4:1, 6:1}, AudioOutputElm);
_.getDumpType = function getDumpType_8(){
  return 211;
}
;
_.getPostCount = function getPostCount_5(){
  return 1;
}
;
_.getVoltageDiff = function getVoltageDiff_4(){
  return this.volts[0];
}
;
_.reset_0 = function reset_3(){
  $reset_0(this);
}
;
_.setPoints = function setPoints_8(){
  $setPoints(this);
  this.lead1 = new Point;
}
;
_.stepFinished = function stepFinished_3(){
  this.dataSample += this.volts[0];
  ++this.dataSampleCount;
  if (sim.t >= this.nextDataSample) {
    this.nextDataSample += this.sampleStep;
    this.data_0[this.dataPtr++] = this.dataSample / this.dataSampleCount;
    this.dataSampleCount = 0;
    this.dataSample = 0;
    if (this.dataPtr >= this.dataCount) {
      this.dataPtr = 0;
      this.dataFull = true;
    }
  }
}
;
_.dataCount = 0;
_.dataFull = false;
_.dataPtr = 0;
_.dataSample = 0;
_.dataSampleCount = 0;
_.dataStart = 0;
_.duration = 0;
_.nextDataSample = 0;
_.sampleStep = 0;
_.samplingRate = 0;
var Lcom_lushprojects_circuitjs1_client_AudioOutputElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'AudioOutputElm', 28);
function $calculateCurrent(this$static){
  var voltdiff;
  voltdiff = this$static.volts[0] - this$static.volts[this$static.capNode2];
  if (app.dcAnalysisFlag) {
    this$static.current_1 = voltdiff / $intern_19;
    return;
  }
  this$static.compResistance > 0 && (this$static.current_1 = voltdiff / this$static.compResistance + this$static.curSourceValue);
}

function $setPoints_2(this$static){
  var f;
  $setPoints(this$static);
  f = (this$static.dn / 2 - 4) / this$static.dn;
  this$static.lead1 = $interpPoint(this$static.point1, this$static.point2, f);
  this$static.lead2 = $interpPoint(this$static.point1, this$static.point2, 1 - f);
  this$static.plate1 = $newPointArray(2);
  this$static.plate2 = $newPointArray(2);
  $interpPoint2(this$static.point1, this$static.point2, this$static.plate1[0], this$static.plate1[1], f, 12);
  $interpPoint2(this$static.point1, this$static.point2, this$static.plate2[0], this$static.plate2[1], 1 - f, 12);
}

function CapacitorElm(xa, ya, xb, yb, f, st){
  CircuitElm.call(this, xa, ya, xb, yb, f);
  this.capacitance = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.voltdiff = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.initialVoltage = $intern_17;
  try {
    this.initialVoltage = $doubleValue(__parseAndValidateDouble($nextToken(st)));
    (this.flags & 4) != 0 && (this.seriesResistance = $doubleValue(__parseAndValidateDouble($nextToken(st))));
  }
   catch ($e0) {
    $e0 = toJava($e0);
    if (!instanceOf($e0, 9))
      throw toJs($e0);
  }
  $allocNodes(this);
}

defineClass(50, 4, {50:1, 4:1, 6:1}, CapacitorElm);
_.calculateCurrent = function calculateCurrent_2(){
  $calculateCurrent(this);
}
;
_.doStep = function doStep_6(){
  if (app.dcAnalysisFlag)
    return;
  $stampCurrentSource(this.nodes[0], this.nodes[this.capNode2], this.curSourceValue);
}
;
_.getDumpType = function getDumpType_9(){
  return 99;
}
;
_.getInternalNodeCount = function getInternalNodeCount_1(){
  return !app.dcAnalysisFlag && this.seriesResistance > 0?1:0;
}
;
_.isIdealCapacitor_0 = function isIdealCapacitor_0(){
  return this.seriesResistance == 0;
}
;
_.isIdealCapacitor = function(){
  return this.isIdealCapacitor_0();
}
;
_.reset_0 = function reset_4(){
  $reset(this);
  this.current_1 = this.curSourceValue = 0;
  this.voltdiff = this.initialVoltage;
}
;
_.setNodeVoltage = function setNodeVoltage_0(n, c){
  this.volts[n] = c;
}
;
_.setPoints = function setPoints_9(){
  $setPoints_2(this);
}
;
_.stamp = function stamp_7(){
  if (app.dcAnalysisFlag) {
    $stampResistor(this.nodes[0], this.nodes[1], $intern_19);
    this.curSourceValue = 0;
    this.capNode2 = 1;
    return;
  }
  this.capNode2 = this.seriesResistance > 0?2:1;
  (this.flags & 2) == 0?(this.compResistance = sim.timeStep_0 / (2 * this.capacitance)):(this.compResistance = sim.timeStep_0 / this.capacitance);
  $stampResistor(this.nodes[0], this.nodes[this.capNode2], this.compResistance);
  this.seriesResistance > 0 && $stampResistor(this.nodes[1], this.nodes[2], this.seriesResistance);
}
;
_.startIteration = function startIteration_0(){
  (this.flags & 2) == 0?(this.curSourceValue = -this.voltdiff / this.compResistance - this.current_1):(this.curSourceValue = -this.voltdiff / this.compResistance);
}
;
_.stepFinished = function stepFinished_4(){
  this.voltdiff = this.volts[0] - this.volts[this.capNode2];
  $calculateCurrent(this);
}
;
_.validate = function validate_4(){
  var fpi;
  if (this.seriesResistance == 0) {
    fpi = new FindPathInfo(3, this, this.nodes[1], sim);
    if ($findPath(fpi, this.nodes[0])) {
      console.log(this + ' shorted');
      $reset(this);
      this.voltdiff = this.current_1 = this.curSourceValue = 0;
    }
     else {
      fpi = new FindPathInfo(4, this, this.nodes[1], sim);
      if ($findPath(fpi, this.nodes[0])) {
        this.seriesResistance = 0.1;
        return false;
      }
    }
  }
  return true;
}
;
_.capNode2 = 0;
_.capacitance = 0;
_.compResistance = 0;
_.curSourceValue = 0;
_.initialVoltage = 0;
_.seriesResistance = 0;
_.voltdiff = 0;
var Lcom_lushprojects_circuitjs1_client_CapacitorElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'CapacitorElm', 50);
function $clinit_ChipElm(){
  $clinit_ChipElm = emptyMethod;
  sideFlipXY = stampJavaTypeInfo(getClassLiteralForArray(I_classLit, 1), $intern_12, 5, 15, [2, 3, 0, 1]);
}

function $doStep(this$static){
  var i, p;
  for (i = 0; i != this$static.getPostCount(); i++) {
    p = this$static.pins[i];
    p.output && $updateVoltageSource(p.voltSource, p.value_0?this$static.highVoltage:0);
  }
}

function $makeBitPins(this$static, count, pos, side, offset, name_0, output, state, reversed){
  var i, ii;
  for (i = 0; i != count; i++) {
    ii = reversed?offset + count - 1 - i:offset + i;
    if (this$static.bitOrder == 2) {
      this$static.pins[ii] = new ChipElm$Pin(this$static, pos, side, name_0);
      this$static.pins[ii].busWidth = count;
      this$static.pins[ii].busZ = i;
    }
     else 
      this$static.bitOrder == 1?(this$static.pins[ii] = new ChipElm$Pin(this$static, pos + i, side, name_0 + i)):(this$static.pins[ii] = new ChipElm$Pin(this$static, pos + (count - 1 - i), side, name_0 + i));
    this$static.pins[ii].output = output;
    this$static.pins[ii].state = state;
  }
}

function $reset_1(this$static){
  var i;
  for (i = 0; i != this$static.getPostCount(); i++) {
    this$static.pins[i].value_0 = false;
    this$static.volts[i] = 0;
  }
  this$static.lastClock = false;
}

function $setPoints_3(this$static){
  var i, p, x0, xr, xs, y0, yr, ys;
  x0 = this$static.x_0 + this$static.cspc2;
  y0 = this$static.y_0;
  xr = x0 - this$static.cspc;
  yr = y0 - this$static.cspc;
  this$static.flippedSizeX = this$static.sizeX;
  this$static.flippedSizeY = this$static.sizeY;
  if ((this$static.flags & 4096) != 0) {
    this$static.flippedSizeX = this$static.sizeY;
    this$static.flippedSizeY = this$static.sizeX;
  }
  xs = this$static.flippedSizeX * this$static.cspc2;
  ys = this$static.flippedSizeY * this$static.cspc2;
  for (i = 0; i != this$static.getPostCount(); i++) {
    p = this$static.pins[i];
    p.side = p.side0;
    (this$static.flags & 4096) != 0 && (p.side = sideFlipXY[p.side]);
    switch (p.side) {
      case 0:
        $setPoint(p, x0, y0, 1, 0, 0, -1, 0, 0);
        break;
      case 1:
        $setPoint(p, x0, y0, 1, 0, 0, 1, 0, ys - this$static.cspc2);
        break;
      case 2:
        $setPoint(p, x0, y0, 0, 1, -1, 0, 0, 0);
        break;
      case 3:
        $setPoint(p, x0, y0, 0, 1, 1, 0, xs - this$static.cspc2, 0);
    }
  }
  this$static.rectPointsX = stampJavaTypeInfo(getClassLiteralForArray(I_classLit, 1), $intern_12, 5, 15, [xr, xr + xs, xr + xs, xr]);
  this$static.rectPointsY = stampJavaTypeInfo(getClassLiteralForArray(I_classLit, 1), $intern_12, 5, 15, [yr, yr, yr + ys, yr + ys]);
  $setBbox(this$static, xr, yr, this$static.rectPointsX[2], this$static.rectPointsY[2]);
}

function $setVoltageSource(this$static, j, vs){
  var i, p;
  for (i = 0; i != this$static.getPostCount(); i++) {
    p = this$static.pins[i];
    if (p.output && j-- == 0) {
      p.voltSource = vs;
      $setNodes(vs, ground, this$static.nodes[i]);
      return;
    }
  }
}

function $stamp(this$static){
  var i, p, vsc;
  vsc = 0;
  for (i = 0; i != this$static.getPostCount(); i++) {
    p = this$static.pins[i];
    if (p.output) {
      $stampVoltageSource(ground, this$static.nodes[i], p.voltSource);
      ++vsc;
    }
  }
  vsc != this$static.getVoltageSourceCount() && (console.log('voltage source count does not match number of outputs') , undefined);
}

function $startIteration(this$static){
  var i, p;
  for (i = 0; i != this$static.getPostCount(); i++) {
    p = this$static.pins[i];
    p.output || (p.value_0 = this$static.volts[i] > this$static.highVoltage / 2);
  }
  this$static.execute_0();
}

function $writeOutput(this$static, n, value_0){
  this$static.pins[n].output || (console.log('pin ' + n + ' is not an output!') , undefined);
  this$static.pins[n].value_0 = value_0;
}

function ChipElm(xa, ya, xb, yb, f, st){
  var i;
  CircuitElm.call(this, xa, ya, xb, yb, f);
  this.needsBits() && ($hasMoreTokens(st)?(this.bits = (new Integer_0($nextToken(st))).value_0):(this.bits = 4));
  this.highVoltage = (this.flags & 8192) != 0?__parseAndValidateDouble($nextToken(st)):5;
  this.setupPins();
  this.cspc = 8 * ((f & 1) != 0?1:2);
  this.cspc2 = this.cspc * 2;
  this.flags &= -2;
  this.flags |= ((f & 1) != 0?1:2) == 1?1:0;
  for (i = 0; i != this.getPostCount(); i++) {
    if (this.pins == null)
      this.volts[i] = $doubleValue(__parseAndValidateDouble($nextToken(st)));
    else if (this.pins[i].state) {
      this.volts[i] = $doubleValue(__parseAndValidateDouble($nextToken(st)));
      this.pins[i].value_0 = this.volts[i] > this.highVoltage / 2;
    }
  }
}

defineClass(18, 4, $intern_20);
_.doStep = function doStep_7(){
  $doStep(this);
}
;
_.execute_0 = function execute(){
}
;
_.getConnection = function getConnection_3(n1, n2){
  return false;
}
;
_.getCurrentIntoNode = function getCurrentIntoNode_3(n){
  return this.pins[n].current_0;
}
;
_.getPost = function getPost_3(n){
  return this.pins[n].post;
}
;
_.getPostWidth = function getPostWidth_0(n){
  return this.pins[n].busWidth;
}
;
_.hasGroundConnection = function hasGroundConnection_5(n1){
  return this.pins[n1].output;
}
;
_.initBoundingBox = function initBoundingBox_0(){
  var fsx, fsy, xr, xs, yr, ys;
  this.boundingBox = new Rectangle;
  $setBounds(this.boundingBox, min_1(this.x_0, this.x2), min_1(this.y_0, this.y2), abs_0(this.x2 - this.x_0) + 1, abs_0(this.y2 - this.y_0) + 1);
  if (this.pins == null || this.cspc == 0)
    return;
  xr = this.x_0 + this.cspc2 - this.cspc;
  yr = this.y_0 - this.cspc;
  fsx = (this.flags & 4096) != 0?this.sizeY:this.sizeX;
  fsy = (this.flags & 4096) != 0?this.sizeX:this.sizeY;
  xs = fsx * this.cspc2;
  ys = fsy * this.cspc2;
  $setBbox(this, xr, yr, xr + xs, yr + ys);
}
;
_.needsBits = function needsBits(){
  return false;
}
;
_.reset_0 = function reset_5(){
  $reset_1(this);
}
;
_.setCurrent = function setCurrent_0(vs, c){
  var i;
  for (i = 0; i != this.getPostCount(); i++)
    this.pins[i].output && this.pins[i].voltSource == vs && (this.pins[i].current_0 = c);
}
;
_.setPoints = function setPoints_10(){
  $setPoints_3(this);
}
;
_.setVoltageSource = function setVoltageSource_3(j, vs){
  $setVoltageSource(this, j, vs);
}
;
_.stamp = function stamp_8(){
  $stamp(this);
}
;
_.startIteration = function startIteration_1(){
  $startIteration(this);
}
;
_.validate = function validate_5(){
  var i;
  for (i = 0; i != this.getPostCount(); i++)
    if (this.pins[i].output && !$validateRailNode(this, i))
      return false;
  return true;
}
;
_.bitOrder = 0;
_.bits = 0;
_.cspc = 0;
_.cspc2 = 0;
_.flippedSizeX = 0;
_.flippedSizeY = 0;
_.highVoltage = 0;
_.lastClock = false;
_.sizeX = 0;
_.sizeY = 0;
var sideFlipXY;
var Lcom_lushprojects_circuitjs1_client_ChipElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'ChipElm', 18);
function $setPoint(this$static, px, py, dx, dy, dax, day, sx, sy){
  var busExtra, xa, ya;
  if ((this$static.this$01.flags & 1024) != 0) {
    dx = -dx;
    dax = -dax;
    px += this$static.this$01.cspc2 * (this$static.this$01.flippedSizeX - 1);
    sx = -sx;
  }
  if ((this$static.this$01.flags & 2048) != 0) {
    dy = -dy;
    day = -day;
    py += this$static.this$01.cspc2 * (this$static.this$01.flippedSizeY - 1);
    sy = -sy;
  }
  xa = px + this$static.this$01.cspc2 * dx * this$static.pos + sx;
  ya = py + this$static.this$01.cspc2 * dy * this$static.pos + sy;
  this$static.post = new Point_0(xa + dax * this$static.this$01.cspc2, ya + day * this$static.this$01.cspc2);
  busExtra = this$static.busWidth > 1?2:0;
  new Point_0(xa + dax * (this$static.this$01.cspc + busExtra), ya + day * (this$static.this$01.cspc + busExtra));
  this$static.textloc = new Point_0(xa, ya);
  this$static.post.z_0 = this$static.busZ;
  if (this$static.clock) {
    if (this$static.clockPointsX == null) {
      this$static.clockPointsX = initUnidimensionalArray(I_classLit, $intern_12, 5, 3, 15, 1);
      this$static.clockPointsY = initUnidimensionalArray(I_classLit, $intern_12, 5, 3, 15, 1);
    }
    this$static.clockPointsX[0] = xa + dax * this$static.this$01.cspc - (dx * this$static.this$01.cspc / 2 | 0);
    this$static.clockPointsY[0] = ya + day * this$static.this$01.cspc - (dy * this$static.this$01.cspc / 2 | 0);
    this$static.clockPointsX[1] = xa;
    this$static.clockPointsY[1] = ya;
    this$static.clockPointsX[2] = xa + dax * this$static.this$01.cspc + (dx * this$static.this$01.cspc / 2 | 0);
    this$static.clockPointsY[2] = ya + day * this$static.this$01.cspc + (dy * this$static.this$01.cspc / 2 | 0);
    if (this$static.text_0.length > 0) {
      this$static.clockPointsX[1] += dax * this$static.this$01.cspc / 2 | 0;
      this$static.clockPointsY[1] += day * this$static.this$01.cspc / 2 | 0;
      this$static.textloc.x_0 -= dax * this$static.this$01.cspc / 2 | 0;
      this$static.textloc.y_0 -= day * this$static.this$01.cspc / 4 | 0;
    }
  }
   else {
    this$static.clockPointsX = null;
    this$static.clockPointsY = null;
  }
}

function ChipElm$Pin(this$0, p, s, t){
  this.this$01 = this$0;
  this.pos = p;
  this.side0 = this.side = s;
  this.text_0 = t;
}

defineClass(12, 1, {12:1}, ChipElm$Pin);
_.busWidth = 1;
_.busZ = 0;
_.clock = false;
_.current_0 = 0;
_.output = false;
_.pos = 0;
_.side = 0;
_.side0 = 0;
_.state = false;
_.value_0 = false;
var Lcom_lushprojects_circuitjs1_client_ChipElm$Pin_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'ChipElm/Pin', 12);
function $getIterCount(){
  if (null.$_nullMethod() == 0)
    return 0;
  return 0.1 * $wnd.Math.exp((null.$_nullMethod() - 61) / 24);
}

function $getrand(this$static, x_0){
  var q;
  q = round_int($nextInternal(this$static.random, 32));
  q < 0 && (q = -q);
  return q % x_0;
}

function $setStopElm(this$static, msg){
  this$static.stopMessage = msg;
}

function $snapGrid_0(this$static, x_0){
  return x_0 + this$static.gridRound & this$static.gridMask;
}

function CirSim(){
  new Vector;
  new Vector;
  new Vector;
  this.sim = new SimulationManager(this);
}

function console_0(text_0){
  console.log(text_0);
}

defineClass(135, 1, {}, CirSim);
_.dcAnalysisFlag = false;
_.dumpMatrix = false;
_.gridMask = 0;
_.gridRound = 0;
_.gridSize = 0;
_.minFrameRate = 20;
_.simRunning = false;
var Lcom_lushprojects_circuitjs1_client_CirSim_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'CirSim', 135);
function CircuitMatrix(){
  this.nodeList = new Vector;
  this.voltageSourceList = new Vector;
}

defineClass(110, 1, {110:1}, CircuitMatrix);
_.nodeCount = 0;
_.nonLinear = false;
_.size_0 = 0;
var Lcom_lushprojects_circuitjs1_client_CircuitMatrix_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'CircuitMatrix', 110);
function CircuitNode(){
  this.links_0 = new Vector;
}

defineClass(33, 1, {33:1}, CircuitNode);
_.toString_0 = function toString_3(){
  return 'node ' + this.index_0;
}
;
_.index_0 = 0;
_.internal = false;
_.row = 0;
var ground;
var Lcom_lushprojects_circuitjs1_client_CircuitNode_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'CircuitNode', 33);
function CircuitNodeLink(){
}

defineClass(44, 1, {44:1}, CircuitNodeLink);
_.num = 0;
var Lcom_lushprojects_circuitjs1_client_CircuitNodeLink_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'CircuitNodeLink', 44);
function CounterElm(xa, ya, xb, yb, f, st){
  $clinit_ChipElm();
  ChipElm.call(this, xa, ya, xb, yb, f, st);
  this.invertreset = true;
  try {
    this.invertreset = ($clinit_Boolean() , $equalsIgnoreCase($nextToken(st)));
    this.modulus = __parseAndValidateInt($nextToken(st), 10);
  }
   catch ($e0) {
    $e0 = toJava($e0);
    if (!instanceOf($e0, 9))
      throw toJs($e0);
  }
}

defineClass(91, 18, {18:1, 4:1, 91:1, 6:1}, CounterElm);
_.execute_0 = function execute_0(){
  var dir_0, i, lastBit, neg, value_0;
  neg = (this.flags & 8) != 0;
  if (this.pins[0].value_0 != neg && this.lastClock == neg) {
    value_0 = 0;
    dir_0 = 1;
    (this.flags & 4) != 0 && this.pins[this.bits + 2].value_0 && (dir_0 = -1);
    lastBit = 2 + this.bits - 1;
    for (i = 0; i != this.bits; i++)
      this.pins[lastBit - i].value_0 && (value_0 |= 1 << i);
    value_0 += dir_0;
    this.modulus != 0 && (value_0 = (value_0 + this.modulus) % this.modulus);
    for (i = 0; i != this.bits; i++)
      this.pins[lastBit - i].value_0 = (value_0 & 1 << i) != 0;
  }
  if (!this.pins[1].value_0 == this.invertreset) {
    for (i = 0; i != this.bits; i++)
      this.pins[i + 2].value_0 = false;
  }
  this.lastClock = this.pins[0].value_0;
}
;
_.getDumpType = function getDumpType_10(){
  return 164;
}
;
_.getPostCount = function getPostCount_6(){
  return (this.flags & 4) != 0?this.bits + 3:this.bits + 2;
}
;
_.getVoltageSourceCount = function getVoltageSourceCount_4(){
  return this.bits;
}
;
_.needsBits = function needsBits_0(){
  return true;
}
;
_.setupPins = function setupPins(){
  this.sizeX = 2;
  this.sizeY = this.bitOrder == 2?3:this.bits;
  this.pins = initUnidimensionalArray(Lcom_lushprojects_circuitjs1_client_ChipElm$Pin_2_classLit, $intern_6, 12, (this.flags & 4) != 0?this.bits + 3:this.bits + 2, 0, 1);
  this.pins[0] = new ChipElm$Pin(this, 0, 2, '');
  this.pins[0].clock = true;
  this.pins[1] = new ChipElm$Pin(this, this.sizeY - 1, 2, 'R');
  $makeBitPins(this, this.bits, 0, 3, 2, 'Q', true, true, true);
  (this.flags & 4) != 0 && (this.pins[this.bits + 2] = new ChipElm$Pin(this, this.sizeY - 2, 2, 'U/D'));
  $allocNodes(this);
}
;
_.invertreset = false;
_.modulus = 0;
var Lcom_lushprojects_circuitjs1_client_CounterElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'CounterElm', 91);
function $setBroken(this$static, b){
  this$static.broken = b && !(this$static.maxVoltage > 0);
}

function $setPoints_4(this$static){
  var p2;
  $setPoints(this$static);
  $calcLeads(this$static, 26);
  $interpPoint(this$static.lead1, this$static.lead2, 0.25);
  $interpPoint(this$static.lead1, this$static.lead2, 0.6);
  this$static.center = $interpPoint(this$static.lead1, this$static.lead2, 0.5);
  p2 = $interpPoint(this$static.lead1, this$static.lead2, 0.75);
  $calcArrow(this$static.center, p2, 4, 4);
}

function CurrentElm(xa, ya, xb, yb, f, st){
  CircuitElm.call(this, xa, ya, xb, yb, f);
  try {
    this.currentValue = $doubleValue(__parseAndValidateDouble($nextToken(st)));
    this.maxVoltage = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  }
   catch ($e0) {
    $e0 = toJava($e0);
    if (!instanceOf($e0, 9))
      throw toJs($e0);
  }
  this.currentValue == 0 && (this.currentValue = $intern_21);
}

defineClass(46, 4, {4:1, 46:1, 6:1}, CurrentElm);
_.doStep = function doStep_8(){
  var absG, arg, g, i, maxStep, sech2, tanhArg, vMid, vStart, vWidth, vd, vt;
  if (this.broken || !(this.maxVoltage > 0))
    return;
  vd = this.volts[1] - this.volts[0];
  vStart = 0.95 * this.maxVoltage;
  vWidth = this.maxVoltage - vStart;
  vMid = (vStart + this.maxVoltage) / 2;
  vt = $wnd.Math.max(vWidth / 5, $intern_17);
  if (this.lastVoltDiff < vStart && vd > vStart) {
    vd = vStart;
    sim.converged = false;
  }
   else if (this.lastVoltDiff > this.maxVoltage && vd < this.maxVoltage) {
    vd = this.maxVoltage;
    sim.converged = false;
  }
   else if (this.lastVoltDiff >= vStart && this.lastVoltDiff <= this.maxVoltage) {
    maxStep = $wnd.Math.max(vWidth / 4, $intern_21);
    if (vd > this.lastVoltDiff + maxStep) {
      vd = this.lastVoltDiff + maxStep;
      sim.converged = false;
    }
     else if (vd < this.lastVoltDiff - maxStep) {
      vd = this.lastVoltDiff - maxStep;
      sim.converged = false;
    }
  }
  this.lastVoltDiff = vd;
  arg = (vd - vMid) / vt;
  tanhArg = tanh(arg);
  i = this.currentValue * 0.5 * (1 - tanhArg);
  sech2 = 1 - tanhArg * tanhArg;
  g = -this.currentValue * 0.5 * sech2 / vt * vd;
  absG = $wnd.Math.abs(g) + 1.0E-6;
  $stampResistor(this.nodes[0], this.nodes[1], 1 / absG);
  $stampCurrentSource(this.nodes[0], this.nodes[1], i - g * vd);
  this.current_1 = i;
}
;
_.getDumpType = function getDumpType_11(){
  return 105;
}
;
_.getVoltageDiff = function getVoltageDiff_5(){
  return this.volts[1] - this.volts[0];
}
;
_.nonLinear_0 = function nonLinear_1(){
  return this.maxVoltage > 0;
}
;
_.reset_0 = function reset_6(){
  $reset(this);
  this.lastVoltDiff = 0;
}
;
_.setPoints = function setPoints_11(){
  $setPoints_4(this);
}
;
_.stamp = function stamp_9(){
  if (this.broken) {
    $stampResistor(this.nodes[0], this.nodes[1], $intern_19);
    this.current_1 = 0;
  }
   else if (this.maxVoltage > 0)
  ;
  else {
    $stampCurrentSource(this.nodes[0], this.nodes[1], this.currentValue);
    this.current_1 = this.currentValue;
  }
}
;
_.validate = function validate_6(){
  var fpi;
  fpi = new FindPathInfo(1, this, this.nodes[1], sim);
  $setBroken(this, !$findPath(fpi, this.nodes[0]));
  return true;
}
;
_.broken = false;
_.currentValue = 0;
_.lastVoltDiff = 0;
_.maxVoltage = 0;
var Lcom_lushprojects_circuitjs1_client_CurrentElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'CurrentElm', 46);
function escape_0(s){
  if (s.length == 0)
    return '\\0';
  return $replace($replace($replace($replace($replace($replace($replace($replace(s, '\\', '\\\\'), '\n', '\\n'), ' ', '\\s'), '+', '\\p'), '=', '\\q'), '#', '\\h'), '&', '\\a'), '\r', '\\r');
}

function unescape_0(s){
  var c, i;
  if ($equals_0(s, '\\0'))
    return '';
  for (i = 0; i < s.length; i++) {
    checkCriticalStringElementIndex(i, s.length);
    if (s.charCodeAt(i) == 92) {
      c = (checkCriticalStringElementIndex(i + 1, s.length) , s.charCodeAt(i + 1));
      c == 110?(s = s.substr(0, i) + '\n' + s.substr(i + 2)):c == 114?(s = s.substr(0, i) + '\r' + s.substr(i + 2)):c == 115?(s = s.substr(0, i) + ' ' + s.substr(i + 2)):c == 112?(s = s.substr(0, i) + '+' + s.substr(i + 2)):c == 113?(s = s.substr(0, i) + '=' + s.substr(i + 2)):c == 104?(s = s.substr(0, i) + '#' + s.substr(i + 2)):c == 97?(s = s.substr(0, i) + '&' + s.substr(i + 2)):(s = s.substr(0, i) + ('' + s.substr(i + 1)));
    }
  }
  return s;
}

function $parseDescription(this$static){
  $parseDescription_0(this$static, this$static.description);
}

function $parseDescription_0(this$static, desc){
  var coilNum, n, nodeNum, s, secondary, st, tok;
  st = new StringTokenizer_0(desc, ',:+', true);
  this$static.coilCount = this$static.nodeCount = 0;
  while ($hasMoreTokens(st)) {
    s = $nextToken(st);
    s == '+' && --this$static.nodeCount;
    if (s == ',' || s == '+' || s == ':')
      continue;
    this$static.nodeCount += 2;
    ++this$static.coilCount;
  }
  if (this$static.coilCount == 0) {
    return false;
  }
  this$static.coilNodes = initUnidimensionalArray(I_classLit, $intern_12, 5, this$static.coilCount, 15, 1);
  this$static.coilInductances = initUnidimensionalArray(D_classLit, $intern_7, 5, this$static.coilCount, 15, 1);
  (this$static.coilCurrents == null || this$static.coilCurrents.length != this$static.coilCount) && (this$static.coilCurrents = initUnidimensionalArray(D_classLit, $intern_7, 5, this$static.coilCount, 15, 1));
  this$static.coilCurCounts = initUnidimensionalArray(D_classLit, $intern_7, 5, this$static.coilCount, 15, 1);
  this$static.coilCurSourceValues = initUnidimensionalArray(D_classLit, $intern_7, 5, this$static.coilCount, 15, 1);
  this$static.coilPolarities = initUnidimensionalArray(D_classLit, $intern_7, 5, this$static.coilCount, 15, 1);
  this$static.nodePoints = $newPointArray(this$static.nodeCount);
  this$static.nodeTaps = $newPointArray(this$static.nodeCount);
  this$static.nodeCurrents = initUnidimensionalArray(D_classLit, $intern_7, 5, this$static.nodeCount, 15, 1);
  this$static.nodeCurCounts = initUnidimensionalArray(D_classLit, $intern_7, 5, this$static.nodeCount, 15, 1);
  st = new StringTokenizer_0(desc, ',:+', true);
  nodeNum = 0;
  coilNum = 0;
  this$static.primaryCoils = 0;
  secondary = false;
  this$static.needDots = false;
  while (true) {
    tok = $nextToken(st);
    try {
      n = __parseAndValidateDouble(tok);
    }
     catch ($e0) {
      $e0 = toJava($e0);
      if (instanceOf($e0, 9)) {
        return false;
      }
       else 
        throw toJs($e0);
    }
    if (n == 0) {
      return false;
    }
    this$static.coilNodes[coilNum] = nodeNum;
    this$static.coilInductances[coilNum] = n * n * this$static.inductance;
    this$static.coilPolarities[coilNum] = 1;
    if (n < 0) {
      this$static.coilPolarities[coilNum] = -1;
      this$static.needDots = true;
    }
    nodeNum += 2;
    ++coilNum;
    secondary || (this$static.primaryCoils = coilNum);
    if (!$hasMoreTokens(st))
      break;
    tok = $nextToken(st);
    if (tok == ',')
      continue;
    if (tok == '+') {
      --nodeNum;
      continue;
    }
    if (tok == ':') {
      if (secondary) {
        return false;
      }
      secondary = true;
      continue;
    }
    return false;
  }
  $allocNodes(this$static);
  $setPoints_5(this$static);
  this$static.xformMatrix = null;
  return true;
}

function $setPoints_5(this$static){
  var c, cd, ce, dotp, h, i, maxWidth, n, nn, offset, primaryNodes, step;
  $setPoints(this$static);
  this$static.point2.y_0 = this$static.point1.y_0;
  this$static.flip = (this$static.flags & 1) != 0?-1:1;
  primaryNodes = this$static.primaryCoils == this$static.coilCount?this$static.nodeCount:this$static.coilNodes[this$static.primaryCoils];
  this$static.dn = $wnd.Math.abs(this$static.point1.x_0 - this$static.point2.x_0);
  ce = 0.5 - 12 / this$static.dn;
  cd = 0.5 - 2 / this$static.dn;
  maxWidth = 0;
  for (step = 0; step != 2; step++) {
    c = 0;
    offset = 0;
    for (i = 0; i != this$static.nodeCount; i++) {
      i == primaryNodes && (offset = 0);
      if (step == 1) {
        (i == primaryNodes - 1 || i == this$static.nodeCount - 1) && (offset = maxWidth);
        $interpPoint_2(this$static.point1, this$static.point2, this$static.nodePoints[i], i < primaryNodes?0:1, -offset * this$static.flip);
        $interpPoint_2(this$static.point1, this$static.point2, this$static.nodeTaps[i], i < primaryNodes?ce:1 - ce, -offset * this$static.flip);
      }
      maxWidth = $wnd.Math.max(maxWidth, offset);
      nn = c < this$static.coilCount?this$static.coilNodes[c]:-1;
      if (nn == i) {
        ++c;
        offset += this$static.width_0;
      }
       else {
        offset += 16;
      }
    }
  }
  this$static.ptCore = $newPointArray(4);
  for (i = 0; i != 4; i += 2) {
    h = i == 2?-maxWidth * this$static.flip:0;
    $interpPoint_2(this$static.point1, this$static.point2, this$static.ptCore[i], cd, h);
    $interpPoint_2(this$static.point1, this$static.point2, this$static.ptCore[i + 1], 1 - cd, h);
  }
  if (this$static.needDots) {
    this$static.dots = initUnidimensionalArray(Lcom_lushprojects_circuitjs1_client_Point_2_classLit, $intern_6, 11, this$static.coilCount, 0, 1);
    dotp = $wnd.Math.abs(7 / this$static.width_0);
    for (i = 0; i != this$static.coilCount; i++) {
      n = this$static.coilNodes[i];
      this$static.dots[i] = $interpPoint_0(this$static.nodeTaps[n], this$static.nodeTaps[n + 1], this$static.coilPolarities[i] > 0?dotp:1 - dotp, i < this$static.primaryCoils?-7:7);
    }
  }
   else 
    this$static.dots = null;
}

function CustomTransformerElm(xa, ya, xb, yb, f, st){
  var i, str;
  CircuitElm.call(this, xa, ya, xb, yb, f);
  this.width_0 = 32;
  this.inductance = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.couplingCoef = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  str = $nextToken(st);
  this.description = unescape_0(str);
  this.coilCount = (new Integer_0($nextToken(st))).value_0;
  this.coilCurrents = initUnidimensionalArray(D_classLit, $intern_7, 5, this.coilCount, 15, 1);
  for (i = 0; i != this.coilCount; i++)
    this.coilCurrents[i] = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  $parseDescription_0(this, this.description);
}

defineClass(53, 4, {4:1, 53:1, 6:1}, CustomTransformerElm);
_.calculateCurrent = function calculateCurrent_3(){
  var i, j, n, ni, val, voltdiff;
  for (i = 0; i != this.nodeCount; i++)
    this.nodeCurrents[i] = 0;
  for (i = 0; i != this.coilCount; i++) {
    val = this.coilCurSourceValues[i];
    if (this.xformMatrix != null) {
      for (j = 0; j != this.coilCount; j++) {
        n = this.coilNodes[j];
        voltdiff = this.volts[n] - this.volts[n + 1];
        val += voltdiff * this.xformMatrix[i][j];
      }
    }
    this.coilCurrents[i] = val;
    ni = this.coilNodes[i];
    this.nodeCurrents[ni] += val;
    this.nodeCurrents[ni + 1] -= val;
  }
}
;
_.doStep = function doStep_9(){
  var i, n;
  for (i = 0; i != this.coilCount; i++) {
    n = this.coilNodes[i];
    $stampCurrentSource(this.nodes[n], this.nodes[n + 1], this.coilCurSourceValues[i]);
  }
}
;
_.getConnection = function getConnection_4(n1, n2){
  var i;
  for (i = 0; i != this.coilCount; i++)
    if ($comparePair(n1, n2, this.coilNodes[i], this.coilNodes[i] + 1))
      return true;
  return false;
}
;
_.getCurrentIntoNode = function getCurrentIntoNode_4(n){
  return -this.nodeCurrents[n];
}
;
_.getDumpType = function getDumpType_12(){
  return 406;
}
;
_.getMatrixConnection = function getMatrixConnection_1(n1, n2){
  return true;
}
;
_.getPost = function getPost_4(n){
  return this.nodePoints[n];
}
;
_.getPostCount = function getPostCount_7(){
  return this.nodeCount;
}
;
_.reset_0 = function reset_7(){
  var i;
  for (i = 0; i != this.coilCount; i++)
    this.coilCurrents[i] = this.coilCurSourceValues[i] = this.coilCurCounts[i] = 0;
  for (i = 0; i != this.nodeCount; i++)
    this.volts[i] = this.nodeCurrents[i] = this.nodeCurCounts[i] = 0;
}
;
_.setPoints = function setPoints_12(){
  $setPoints_5(this);
}
;
_.stamp = function stamp_10(){
  var i, j, ni, nj, ts;
  this.xformMatrix = initMultidimensionalArray(D_classLit, [$intern_6, $intern_7], [8, 5], 15, [this.coilCount, this.coilCount], 2);
  for (i = 0; i != this.coilCount; i++)
    this.xformMatrix[i][i] = this.coilInductances[i];
  for (i = 0; i != this.coilCount; i++)
    for (j = 0; j != i; j++)
      this.xformMatrix[i][j] = this.xformMatrix[j][i] = this.couplingCoef * $wnd.Math.sqrt(this.coilInductances[i] * this.coilInductances[j]) * this.coilPolarities[i] * this.coilPolarities[j];
  invertMatrix(this.xformMatrix, this.coilCount);
  ts = (this.flags & 2) == 0?sim.timeStep_0 / 2:sim.timeStep_0;
  for (i = 0; i != this.coilCount; i++)
    for (j = 0; j != this.coilCount; j++) {
      this.xformMatrix[i][j] *= ts;
      ni = this.coilNodes[i];
      nj = this.coilNodes[j];
      i == j?$stampConductance(this.nodes[ni], this.nodes[ni + 1], this.xformMatrix[i][i]):$stampVCCurrentSource(this.nodes[ni], this.nodes[ni + 1], this.nodes[nj], this.nodes[nj + 1], this.xformMatrix[i][j]);
    }
  for (i = 0; i != this.nodeCount; i++)
  ;
}
;
_.startIteration = function startIteration_2(){
  var i, j, n, val, voltdiff;
  for (i = 0; i != this.coilCount; i++) {
    val = this.coilCurrents[i];
    if ((this.flags & 2) == 0) {
      for (j = 0; j != this.coilCount; j++) {
        n = this.coilNodes[j];
        voltdiff = this.volts[n] - this.volts[n + 1];
        val += voltdiff * this.xformMatrix[i][j];
      }
    }
    this.coilCurSourceValues[i] = val;
  }
}
;
_.coilCount = 0;
_.couplingCoef = 0;
_.flip = 0;
_.inductance = 0;
_.needDots = false;
_.nodeCount = 0;
_.primaryCoils = 0;
_.width_0 = 0;
var Lcom_lushprojects_circuitjs1_client_CustomTransformerElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'CustomTransformerElm', 53);
function DCMotorElm(xa, ya, xb, yb, st){
  CircuitElm.call(this, xa, ya, xb, yb, 0);
  this.voltSources = initUnidimensionalArray(Lcom_lushprojects_circuitjs1_client_VoltageSource_2_classLit, $intern_6, 34, 2, 0, 1);
  this.angle = $intern_16;
  this.speed = 0;
  this.inductance = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.resistance = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.K = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.Kb = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.J = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.b = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.gearRatio = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.tau = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.ind = new Inductor(sim);
  this.indInertia = new Inductor(sim);
  $setup_1(this.ind, this.inductance, 0, 2);
  $setup_1(this.indInertia, this.J, 0, 2);
}

defineClass(43, 4, {4:1, 43:1, 6:1}, DCMotorElm);
_.calculateCurrent = function calculateCurrent_4(){
  this.coilCurrent = $calculateCurrent_1(this.ind, this.volts[0] - this.volts[2]);
  this.inertiaCurrent = $calculateCurrent_1(this.indInertia, this.volts[4] - this.volts[5]);
  this.speed = this.inertiaCurrent;
}
;
_.doStep = function doStep_10(){
  $updateVoltageSource(this.voltSources[1], this.coilCurrent * this.K);
  $updateVoltageSource(this.voltSources[0], this.inertiaCurrent * this.Kb);
  $doStep_1(this.ind);
  $doStep_1(this.indInertia);
}
;
_.getDumpType = function getDumpType_13(){
  return 415;
}
;
_.getInternalNodeCount = function getInternalNodeCount_2(){
  return 4;
}
;
_.getPostCount = function getPostCount_8(){
  return 2;
}
;
_.getVoltageSourceCount = function getVoltageSourceCount_5(){
  return 2;
}
;
_.reset_0 = function reset_8(){
  $reset(this);
  $resetTo(this.ind, 0);
  $resetTo(this.indInertia, 0);
  this.coilCurrent = 0;
  this.inertiaCurrent = 0;
}
;
_.setCurrent = function setCurrent_1(vs, c){
  vs == this.voltSources[0] && (this.current_1 = c);
}
;
_.setPoints = function setPoints_13(){
  $setPoints(this);
  $calcLeads(this, 36);
  $interpPoint(this.point1, this.point2, 0.5);
  $allocNodes(this);
}
;
_.setVoltageSource = function setVoltageSource_4(n, v){
  this.voltSources[n] = v;
  n == 0?$setNodes(v, this.nodes[3], this.nodes[1]):$setNodes(v, this.nodes[4], ground);
}
;
_.stamp = function stamp_11(){
  $stamp_2(this.ind, this.nodes[0], this.nodes[2]);
  $stampResistor(this.nodes[2], this.nodes[3], this.resistance);
  $stampVoltageSource(this.nodes[3], this.nodes[1], this.voltSources[0]);
  $stamp_2(this.indInertia, this.nodes[4], this.nodes[5]);
  $stampResistor(this.nodes[5], ground, this.b);
  $stampVoltageSource(this.nodes[4], ground, this.voltSources[1]);
}
;
_.startIteration = function startIteration_3(){
  $startIteration_0(this.ind, this.volts[0] - this.volts[2]);
  $startIteration_0(this.indInertia, this.volts[4] - this.volts[5]);
  this.angle = this.angle + this.speed * sim.timeStep_0;
}
;
_.J = 0;
_.K = 0;
_.Kb = 0;
_.angle = 0;
_.b = 0;
_.coilCurrent = 0;
_.gearRatio = 0;
_.inductance = 0;
_.inertiaCurrent = 0;
_.resistance = 0;
_.speed = 0;
_.tau = 0;
var Lcom_lushprojects_circuitjs1_client_DCMotorElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'DCMotorElm', 43);
function DFlipFlopElm(xa, ya, xb, yb, f, st){
  $clinit_ChipElm();
  ChipElm.call(this, xa, ya, xb, yb, f, st);
  this.pins[2].value_0 = !this.pins[1].value_0;
  this.justLoaded = true;
}

defineClass(146, 18, $intern_20, DFlipFlopElm);
_.execute_0 = function execute_1(){
  var isReset, isSet;
  if (this.justLoaded) {
    this.justLoaded = false;
    return;
  }
  isSet = false;
  isReset = false;
  (this.flags & 4) != 0 && this.pins[5].value_0 != ((this.flags & 8) != 0) && (isSet = true);
  ((this.flags & 2) != 0 || (this.flags & 4) != 0) && this.pins[4].value_0 != ((this.flags & 8) != 0) && (isReset = true);
  if (isSet || isReset) {
    this.pins[1].output || (console.log('pin 1 is not an output!') , undefined);
    this.pins[1].value_0 = false;
    this.pins[2].output || (console.log('pin 2 is not an output!') , undefined);
    this.pins[2].value_0 = false;
    isSet && (this.pins[1].output || (console.log('pin 1 is not an output!') , undefined) , this.pins[1].value_0 = true);
    isReset && (this.pins[2].output || (console.log('pin 2 is not an output!') , undefined) , this.pins[2].value_0 = true);
  }
   else {
    this.pins[3].value_0 && !this.lastClock && $writeOutput(this, 1, this.pins[0].value_0);
    $writeOutput(this, 2, !this.pins[1].value_0);
  }
  this.lastClock = this.pins[3].value_0;
}
;
_.getDumpType = function getDumpType_14(){
  return 155;
}
;
_.getPostCount = function getPostCount_9(){
  return 4 + ((this.flags & 2) != 0 || (this.flags & 4) != 0?1:0) + ((this.flags & 4) != 0?1:0);
}
;
_.getVoltageSourceCount = function getVoltageSourceCount_6(){
  return 2;
}
;
_.reset_0 = function reset_9(){
  $reset_1(this);
  this.volts[2] = this.highVoltage;
  this.pins[2].value_0 = true;
}
;
_.setupPins = function setupPins_0(){
  this.sizeX = 2;
  this.sizeY = 3;
  this.pins = initUnidimensionalArray(Lcom_lushprojects_circuitjs1_client_ChipElm$Pin_2_classLit, $intern_6, 12, 4 + ((this.flags & 2) != 0 || (this.flags & 4) != 0?1:0) + ((this.flags & 4) != 0?1:0), 0, 1);
  this.pins[0] = new ChipElm$Pin(this, 0, 2, 'D');
  this.pins[1] = new ChipElm$Pin(this, 0, 3, 'Q');
  this.pins[1].output = this.pins[1].state = true;
  this.pins[2] = new ChipElm$Pin(this, (this.flags & 4) != 0?1:2, 3, 'Q');
  this.pins[2].output = true;
  this.pins[3] = new ChipElm$Pin(this, 1, 2, '');
  this.pins[3].clock = true;
  if ((this.flags & 4) != 0) {
    this.pins[5] = new ChipElm$Pin(this, 2, 2, 'S');
    this.pins[4] = new ChipElm$Pin(this, 2, 3, 'R');
  }
   else {
    ((this.flags & 2) != 0 || (this.flags & 4) != 0) && (this.pins[4] = new ChipElm$Pin(this, 2, 2, 'R'));
  }
}
;
_.justLoaded = false;
var Lcom_lushprojects_circuitjs1_client_DFlipFlopElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'DFlipFlopElm', 146);
function $setPoints_6(this$static){
  $setPoints(this$static);
  $calcLeads(this$static, 32);
  new Point;
  new Point;
  if ((this$static.flags & 2) != 0) {
    this$static.extraPoints = $newPointArray(7);
    $interpPoint_2(this$static.lead1, this$static.lead2, this$static.extraPoints[0], 0.5, 8);
    $interpPoint_2(this$static.lead1, this$static.lead2, this$static.extraPoints[1], 0.5, 24);
    $interpPoint_2(this$static.lead1, this$static.lead2, this$static.extraPoints[2], 0.4, 24);
    $interpPoint_2(this$static.lead1, this$static.lead2, this$static.extraPoints[3], 0.6, 24);
    $interpPoint_2(this$static.lead1, this$static.lead2, this$static.extraPoints[4], 0.5, 19);
    $interpPoint_2(this$static.lead1, this$static.lead2, this$static.extraPoints[5], 0.4, 16);
    $interpPoint_2(this$static.lead1, this$static.lead2, this$static.extraPoints[6], 0.5, 13);
  }
}

function SwitchElm(xa, ya, xb, yb, f, st){
  var str;
  CircuitElm.call(this, xa, ya, xb, yb, f);
  str = $nextToken(st);
  $compareTo(str, 'true') == 0?(this.position = instanceOf(this, 40)?0:1):$compareTo(str, 'false') == 0?(this.position = instanceOf(this, 40)?1:0):(this.position = (new Integer_0(str)).value_0);
  this.momentary = $booleanValue(($clinit_Boolean() , $equalsIgnoreCase($nextToken(st))));
  this.label_0 = null;
  (this.flags & 4) != 0 && (this.label_0 = unescape_0($nextToken(st)));
}

defineClass(21, 4, {4:1, 6:1, 21:1}, SwitchElm);
_.calculateCurrent = function calculateCurrent_5(){
  this.position == 1?(this.current_1 = 0):this.resistance > 0?(this.current_1 = (this.volts[0] - this.volts[1]) / this.resistance):this.inComposite && (this.current_1 = (this.volts[0] - this.volts[1]) / $intern_17);
}
;
_.getConnection = function getConnection_5(n1, n2){
  return this.position == 0;
}
;
_.getDumpType = function getDumpType_15(){
  return 115;
}
;
_.isRemovableWire = function isRemovableWire_0(){
  return this.position == 0 && !this.inComposite && this.resistance == 0;
}
;
_.isWireEquivalent = function isWireEquivalent_1(){
  return this.position == 0 && !this.inComposite && this.resistance == 0;
}
;
_.setPoints = function setPoints_14(){
  $setPoints_6(this);
}
;
_.stamp = function stamp_12(){
  this.position == 0 && (this.resistance > 0?$stampResistor(this.nodes[0], this.nodes[1], this.resistance):this.inComposite && $stampResistor(this.nodes[0], this.nodes[1], $intern_17));
}
;
_.momentary = false;
_.position = 0;
_.resistance = 0;
var Lcom_lushprojects_circuitjs1_client_SwitchElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'SwitchElm', 21);
function DPDTSwitchElm(xa, ya, xb, yb, f, st){
  SwitchElm.call(this, xa, ya, xb, yb, f, st);
  try {
    this.poleCount = (new Integer_0($nextToken(st))).value_0;
  }
   catch ($e0) {
    $e0 = toJava($e0);
    if (!instanceOf($e0, 9))
      throw toJs($e0);
  }
}

defineClass(78, 21, {4:1, 78:1, 6:1, 21:1}, DPDTSwitchElm);
_.calculateCurrent = function calculateCurrent_6(){
  var i;
  if (this.resistance > 0)
    for (i = 0; i != this.poleCount; i++)
      this.currents[i] = (this.volts[i * 3] - this.volts[i * 3 + 1 + this.position]) / this.resistance;
}
;
_.getConnection = function getConnection_6(n1, n2){
  var i;
  for (i = 0; i != this.poleCount; i++)
    if ($comparePair(n1, n2, i * 3, i * 3 + 1 + this.position))
      return true;
  return false;
}
;
_.getCurrentIntoNode = function getCurrentIntoNode_5(n){
  var n3, t;
  t = n / 3 | 0;
  n3 = n % 3;
  if (n3 == 0)
    return -this.currents[t];
  if (n3 == this.position + 1)
    return this.currents[t];
  return 0;
}
;
_.getDumpType = function getDumpType_16(){
  return 429;
}
;
_.getPost = function getPost_5(n){
  var n3, t;
  t = n / 3 | 0;
  n3 = n % 3;
  if (n3 == 0)
    return this.polePosts[t];
  return this.throwPosts[t * 2 + n3 - 1];
}
;
_.getPostCount = function getPostCount_10(){
  return 3 * this.poleCount;
}
;
_.getVoltageSourceCount = function getVoltageSourceCount_7(){
  return this.resistance > 0?0:this.poleCount;
}
;
_.isRemovableWire = function isRemovableWire_1(){
  return false;
}
;
_.isWireEquivalent = function isWireEquivalent_2(){
  return this.resistance == 0;
}
;
_.setCurrent = function setCurrent_2(vs, c){
  var i;
  for (i = 0; i != this.poleCount; i++)
    vs == this.voltageSources[i] && (this.currents[i] = c);
}
;
_.setPoints = function setPoints_15(){
  var i, offset;
  $setPoints_6(this);
  $calcLeads(this, 32);
  this.voltageSources = initUnidimensionalArray(Lcom_lushprojects_circuitjs1_client_VoltageSource_2_classLit, $intern_6, 34, this.poleCount, 0, 1);
  this.throwPosts = $newPointArray(2 * this.poleCount);
  this.throwLeads = $newPointArray(4 * this.poleCount);
  this.poleLeads = $newPointArray(this.poleCount);
  this.polePosts = $newPointArray(this.poleCount);
  $newPointArray(2);
  this.currents = initUnidimensionalArray(D_classLit, $intern_7, 5, this.poleCount, 15, 1);
  for (i = 0; i != this.poleCount; i++) {
    offset = -i * 16 * 3;
    $interpPoint_2(this.point1, this.point2, this.polePosts[i], 0, offset);
    $interpPoint_2(this.lead1, this.lead2, this.poleLeads[i], 0, offset);
    $interpPoint_2(this.point1, this.point2, this.throwPosts[i * 2], 1, offset - 16);
    $interpPoint_2(this.lead1, this.lead2, this.throwLeads[i * 4], 1, offset - 16);
    $interpPoint_2(this.point1, this.point2, this.throwPosts[i * 2 + 1], 1, offset + 16);
    $interpPoint_2(this.lead1, this.lead2, this.throwLeads[i * 4 + 1], 1, offset + 16);
    $interpPoint_2(this.lead1, this.lead2, this.throwLeads[i * 4 + 2], 1, offset + 5.28);
    (this.flags & 2) != 0?$interpPoint_2(this.lead1, this.lead2, this.throwLeads[i * 4 + 3], 1.2, offset - 5.28):$interpPoint_2(this.lead1, this.lead2, this.throwLeads[i * 4 + 3], 1, offset - 16);
  }
}
;
_.setVoltageSource = function setVoltageSource_5(j, vs){
  this.voltageSources[j] = vs;
  $setNodes(vs, this.nodes[j * 3], this.nodes[this.position + 1 + j * 3]);
}
;
_.stamp = function stamp_13(){
  var i;
  for (i = 0; i != this.poleCount; i++) {
    this.resistance > 0?$stampResistor(this.nodes[i * 3], this.nodes[this.position + 1 + i * 3], this.resistance):$stampVoltageSource_1(this.voltageSources[i]);
  }
}
;
_.validate = function validate_7(){
  var fpi, i;
  if (this.resistance > 0)
    return true;
  for (i = 0; i != this.poleCount; i++) {
    fpi = new FindPathInfo(2, this, this.nodes[i * 3], sim);
    if ($findPath(fpi, $getNode(this, i * 3 + 1 + this.position))) {
      this.resistance = $intern_17;
      return false;
    }
  }
  return true;
}
;
_.poleCount = 0;
var Lcom_lushprojects_circuitjs1_client_DPDTSwitchElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'DPDTSwitchElm', 78);
function $setDataCount(this$static, ct){
  this$static.dataCount = ct;
  this$static.data_0 = initUnidimensionalArray(D_classLit, $intern_7, 5, this$static.dataCount, 15, 1);
  this$static.dataPtr = 0;
  this$static.dataFull = false;
}

function DataRecorderElm(xa, ya, xb, yb, st){
  CircuitElm.call(this, xa, ya, xb, yb, 0);
  $setDataCount(this, __parseAndValidateInt($nextToken(st), 10));
}

defineClass(42, 4, {4:1, 42:1, 6:1}, DataRecorderElm);
_.getDumpType = function getDumpType_17(){
  return 210;
}
;
_.getPostCount = function getPostCount_11(){
  return 1;
}
;
_.getVoltageDiff = function getVoltageDiff_6(){
  return this.volts[0];
}
;
_.reset_0 = function reset_10(){
  this.dataPtr = 0;
  this.dataFull = false;
  this.lastTimeStepCount = 0;
}
;
_.setPoints = function setPoints_16(){
  $setPoints(this);
  this.lead1 = $interpPoint(this.point1, this.point2, 1 - 8 / this.dn);
}
;
_.stepFinished = function stepFinished_5(){
  if (this.lastTimeStepCount == sim.timeStepCount)
    return;
  this.data_0[this.dataPtr++] = this.volts[0];
  this.lastTimeStepCount = sim.timeStepCount;
  if (this.dataPtr >= this.dataCount) {
    this.dataPtr = 0;
    this.dataFull = true;
  }
}
;
_.dataCount = 0;
_.dataFull = false;
_.dataPtr = 0;
_.lastTimeStepCount = 0;
var Lcom_lushprojects_circuitjs1_client_DataRecorderElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'DataRecorderElm', 42);
function $setupPins(this$static){
  this$static.sizeX = 3;
  this$static.sizeY = this$static.bitOrder == 2?2:this$static.bitCount;
  this$static.pins = initUnidimensionalArray(Lcom_lushprojects_circuitjs1_client_ChipElm$Pin_2_classLit, $intern_6, 12, this$static.bitCount, 0, 1);
  $makeBitPins(this$static, this$static.bitCount, 0, 2, 0, 'I', false, false, false);
  $allocNodes(this$static);
}

function DecimalDisplayElm(xa, ya, xb, yb, st){
  $clinit_ChipElm();
  ChipElm.call(this, xa, ya, xb, yb, 0, st);
  this.bitCount = 4;
  try {
    this.bitCount = __parseAndValidateInt($nextToken(st), 10);
    this.displayMode = __parseAndValidateInt($nextToken(st), 10);
  }
   catch ($e0) {
    $e0 = toJava($e0);
    if (!instanceOf($e0, 9))
      throw toJs($e0);
  }
  $setupPins(this);
}

defineClass(64, 18, {18:1, 4:1, 64:1, 6:1}, DecimalDisplayElm);
_.getDumpType = function getDumpType_18(){
  return 419;
}
;
_.getPostCount = function getPostCount_12(){
  return this.bitCount;
}
;
_.getVoltageSourceCount = function getVoltageSourceCount_8(){
  return 0;
}
;
_.setupPins = function setupPins_1(){
  $setupPins(this);
}
;
_.bitCount = 0;
_.displayMode = 0;
var Lcom_lushprojects_circuitjs1_client_DecimalDisplayElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'DecimalDisplayElm', 64);
function DiacElm(xa, ya, xb, yb, f, st){
  CircuitElm.call(this, xa, ya, xb, yb, f);
  this.onresistance = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.offresistance = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.breakdown = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.holdcurrent = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.diode1 = new Diode(sim);
  this.diode2 = new Diode(sim);
  $setup(this.diode1, getModelWithName('default'));
  $setup(this.diode2, getModelWithName('default'));
}

defineClass(73, 4, {4:1, 73:1, 6:1}, DiacElm);
_.calculateCurrent = function calculateCurrent_7(){
  var r;
  r = this.state?this.onresistance:this.offresistance;
  this.current_1 = (this.volts[0] - this.volts[2]) / r + (this.volts[0] - this.volts[3]) / r;
}
;
_.doStep = function doStep_11(){
  var r;
  r = this.state?this.onresistance:this.offresistance;
  $stampResistor(this.nodes[0], this.nodes[2], r);
  $stampResistor(this.nodes[0], this.nodes[3], r);
  $doStep_0(this.diode1, this.volts[2] - this.volts[1]);
  $doStep_0(this.diode2, this.volts[1] - this.volts[3]);
}
;
_.getDumpType = function getDumpType_19(){
  return 203;
}
;
_.getInternalNodeCount = function getInternalNodeCount_3(){
  return 2;
}
;
_.nonLinear_0 = function nonLinear_2(){
  return true;
}
;
_.setPoints = function setPoints_17(){
  var i, p1, p2, p3, sgn;
  $setPoints(this);
  $calcLeads(this, 16);
  this.plate1 = $newPointArray(2);
  this.plate2 = $newPointArray(2);
  $interpPoint2(this.lead1, this.lead2, this.plate1[0], this.plate1[1], 0, 16);
  $interpPoint2(this.lead1, this.lead2, this.plate2[0], this.plate2[1], 1, 16);
  this.arrows = initUnidimensionalArray(Lcom_lushprojects_circuitjs1_client_Polygon_2_classLit, $intern_6, 74, 2, 0, 1);
  for (i = 0; i != 2; i++) {
    sgn = -1 + i * 2;
    p1 = $interpPoint_0(this.lead1, this.lead2, i, 8 * sgn);
    p2 = $interpPoint_0(this.lead1, this.lead2, 1 - i, 16 * sgn);
    p3 = $interpPoint_0(this.lead1, this.lead2, 1 - i, 0);
    this.arrows[i] = $createPolygon(p1, p2, p3);
  }
}
;
_.stamp = function stamp_14(){
  $stamp_0(this.diode1, this.nodes[2], this.nodes[1]);
  $stamp_0(this.diode2, this.nodes[1], this.nodes[3]);
}
;
_.startIteration = function startIteration_4(){
  var vd;
  vd = this.volts[0] - this.volts[1];
  $wnd.Math.abs(this.current_1) < this.holdcurrent && (this.state = false);
  $wnd.Math.abs(vd) > this.breakdown && (this.state = true);
}
;
_.breakdown = 0;
_.holdcurrent = 0;
_.offresistance = 0;
_.onresistance = 0;
_.state = false;
var Lcom_lushprojects_circuitjs1_client_DiacElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'DiacElm', 73);
function $calculateCurrent_0(this$static, voltdiff){
  if (voltdiff >= 0 || this$static.zvoltage == 0)
    return this$static.leakage * ($wnd.Math.exp(voltdiff * this$static.vdcoef) - 1);
  return this$static.leakage * ($wnd.Math.exp(voltdiff * this$static.vdcoef) - $wnd.Math.exp((-voltdiff - this$static.zoffset) * $intern_22) - 1);
}

function $doStep_0(this$static, voltdiff){
  var eval_0, geq, gmin, nc;
  $wnd.Math.abs(voltdiff - this$static.lastvoltdiff) > $intern_21 && (this$static.sim.converged = false);
  voltdiff = $limitStep(this$static, voltdiff, this$static.lastvoltdiff);
  this$static.lastvoltdiff = voltdiff;
  gmin = this$static.leakage * $intern_21;
  if (this$static.sim.subIterations > 100) {
    gmin = $wnd.Math.exp(-9 * $wnd.Math.log(10) * (1 - this$static.sim.subIterations / 3000));
    gmin > 0.1 && (gmin = 0.1);
  }
  if (voltdiff >= 0 || this$static.zvoltage == 0) {
    eval_0 = $wnd.Math.exp(voltdiff * this$static.vdcoef);
    geq = this$static.vdcoef * this$static.leakage * eval_0 + gmin;
    nc = (eval_0 - 1) * this$static.leakage - geq * voltdiff;
    $stampConductance(this$static.nodes[0], this$static.nodes[1], geq);
    $stampCurrentSource(this$static.nodes[0], this$static.nodes[1], nc);
  }
   else {
    geq = this$static.leakage * (this$static.vdcoef * $wnd.Math.exp(voltdiff * this$static.vdcoef) + $intern_22 * $wnd.Math.exp((-voltdiff - this$static.zoffset) * $intern_22)) + gmin;
    nc = this$static.leakage * ($wnd.Math.exp(voltdiff * this$static.vdcoef) - $wnd.Math.exp((-voltdiff - this$static.zoffset) * $intern_22) - 1) + geq * -voltdiff;
    $stampConductance(this$static.nodes[0], this$static.nodes[1], geq);
    $stampCurrentSource(this$static.nodes[0], this$static.nodes[1], nc);
  }
}

function $limitStep(this$static, vnew, vold){
  var arg;
  if (vnew > this$static.vcrit && $wnd.Math.abs(vnew - vold) > this$static.vscale + this$static.vscale) {
    if (vold > 0) {
      arg = 1 + (vnew - vold) / this$static.vscale;
      arg > 0?(vnew = vold + this$static.vscale * $wnd.Math.log(arg)):(vnew = this$static.vcrit);
    }
     else {
      vnew = this$static.vscale * $wnd.Math.log(vnew / this$static.vscale);
    }
    this$static.sim.converged = false;
  }
   else if (vnew < 0 && this$static.zoffset != 0) {
    vnew = -vnew - this$static.zoffset;
    vold = -vold - this$static.zoffset;
    if (vnew > this$static.vzcrit && $wnd.Math.abs(vnew - vold) > 0.05173) {
      if (vold > 0) {
        arg = 1 + (vnew - vold) / $intern_23;
        arg > 0?(vnew = vold + $intern_23 * $wnd.Math.log(arg)):(vnew = this$static.vzcrit);
      }
       else {
        vnew = $intern_23 * $wnd.Math.log(vnew / $intern_23);
      }
      this$static.sim.converged = false;
    }
    vnew = -(vnew + this$static.zoffset);
  }
  return vnew;
}

function $setup(this$static, model){
  this$static.leakage = model.saturationCurrent;
  this$static.zvoltage = model.breakdownVoltage;
  this$static.vscale = model.vscale;
  this$static.vdcoef = model.vdcoef;
  this$static.vcrit = this$static.vscale * $wnd.Math.log(this$static.vscale / ($wnd.Math.sqrt(2) * this$static.leakage));
  this$static.vzcrit = $intern_23 * $wnd.Math.log($intern_23 / ($wnd.Math.sqrt(2) * this$static.leakage));
  this$static.zvoltage == 0?(this$static.zoffset = 0):(this$static.zoffset = this$static.zvoltage - $wnd.Math.log(-(1 + -0.005 / this$static.leakage)) / $intern_22);
}

function $stamp_0(this$static, n0, n1){
  this$static.nodes[0] = n0;
  this$static.nodes[1] = n1;
}

function Diode(s){
  this.sim = s;
  this.nodes = initUnidimensionalArray(Lcom_lushprojects_circuitjs1_client_CircuitNode_2_classLit, $intern_6, 33, 2, 0, 1);
}

defineClass(27, 1, {27:1}, Diode);
_.lastvoltdiff = 0;
_.leakage = 0;
_.vcrit = 0;
_.vdcoef = 0;
_.vscale = 0;
_.vzcrit = 0;
_.zoffset = 0;
_.zvoltage = 0;
var Lcom_lushprojects_circuitjs1_client_Diode_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'Diode', 27);
function $reset_2(this$static){
  this$static.diode.lastvoltdiff = 0;
  this$static.volts[0] = this$static.volts[1] = 0;
  this$static.hasResistance && (this$static.volts[2] = 0);
}

function $setPoints_7(this$static){
  var pa;
  $setPoints(this$static);
  $calcLeads(this$static, 16);
  this$static.cathode_0 = $newPointArray(2);
  pa = $newPointArray(2);
  $interpPoint2(this$static.lead1, this$static.lead2, pa[0], pa[1], 0, 8);
  $interpPoint2(this$static.lead1, this$static.lead2, this$static.cathode_0[0], this$static.cathode_0[1], 1, 8);
  $createPolygon(pa[0], pa[1], this$static.lead2);
}

function $setup_0(this$static){
  this$static.model = getModelWithNameOrCopy(this$static.modelName, this$static.model);
  this$static.modelName = this$static.model.name_0;
  $setup(this$static.diode, this$static.model);
  this$static.hasResistance = this$static.model.seriesResistance > 0;
  this$static.diodeEndNode = this$static.hasResistance?2:1;
  $allocNodes(this$static);
}

function $stamp_1(this$static){
  if (this$static.hasResistance) {
    $stamp_0(this$static.diode, this$static.nodes[0], this$static.nodes[2]);
    $stampResistor(this$static.nodes[1], this$static.nodes[2], this$static.model.seriesResistance);
  }
   else 
    $stamp_0(this$static.diode, this$static.nodes[0], this$static.nodes[1]);
}

function DiodeElm(xa, ya, xb, yb, f, st){
  var fwdrop;
  CircuitElm.call(this, xa, ya, xb, yb, f);
  this.diode = new Diode(sim);
  fwdrop = 0.805904783;
  if ((f & 2) != 0) {
    this.modelName = unescape_0($nextToken(st));
  }
   else {
    if ((f & 1) > 0) {
      try {
        fwdrop = $doubleValue(__parseAndValidateDouble($nextToken(st)));
      }
       catch ($e0) {
        $e0 = toJava($e0);
        if (!instanceOf($e0, 9))
          throw toJs($e0);
      }
    }
    this.model = getModelWithParameters(fwdrop, 0);
    this.modelName = this.model.name_0;
  }
  $setup_0(this);
}

defineClass(26, 4, $intern_24, DiodeElm);
_.calculateCurrent = function calculateCurrent_8(){
  this.current_1 = $calculateCurrent_0(this.diode, this.volts[0] - this.volts[this.diodeEndNode]);
}
;
_.doStep = function doStep_12(){
  $doStep_0(this.diode, this.volts[0] - this.volts[this.diodeEndNode]);
}
;
_.getDumpType = function getDumpType_20(){
  return 100;
}
;
_.getInternalNodeCount = function getInternalNodeCount_4(){
  return this.hasResistance?1:0;
}
;
_.nonLinear_0 = function nonLinear_3(){
  return true;
}
;
_.reset_0 = function reset_11(){
  $reset_2(this);
}
;
_.setPoints = function setPoints_18(){
  $setPoints_7(this);
}
;
_.stamp = function stamp_15(){
  $stamp_1(this);
}
;
_.stepFinished = function stepFinished_6(){
  $wnd.Math.abs(this.current_1) > $intern_25 && $stop(sim, 'max current exceeded');
}
;
_.diodeEndNode = 0;
_.hasResistance = false;
var Lcom_lushprojects_circuitjs1_client_DiodeElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'DiodeElm', 26);
function $setInternal(this$static){
  this$static.internal = true;
  return this$static;
}

function $undump(this$static, st){
  this$static.flags = (new Integer_0($nextToken(st))).value_0;
  this$static.saturationCurrent = __parseAndValidateDouble($nextToken(st));
  this$static.seriesResistance = __parseAndValidateDouble($nextToken(st));
  this$static.emissionCoefficient = __parseAndValidateDouble($nextToken(st));
  this$static.breakdownVoltage = __parseAndValidateDouble($nextToken(st));
  try {
    this$static.forwardCurrent = __parseAndValidateDouble($nextToken(st));
  }
   catch ($e0) {
    $e0 = toJava($e0);
    if (!instanceOf($e0, 9))
      throw toJs($e0);
  }
  $updateModel(this$static);
}

function $updateModel(this$static){
  this$static.vscale = this$static.emissionCoefficient * $intern_23;
  this$static.vdcoef = 1 / this$static.vscale;
  this$static.fwdrop = $wnd.Math.log(1 / this$static.saturationCurrent + 1) * this$static.emissionCoefficient * $intern_23;
}

function DiodeModel(){
  this.saturationCurrent = 1.0E-14;
  this.seriesResistance = 0;
  this.emissionCoefficient = 1;
  this.breakdownVoltage = 0;
  $updateModel(this);
}

function DiodeModel_0(sc, sr, ec, bv){
  this.saturationCurrent = sc;
  this.seriesResistance = sr;
  this.emissionCoefficient = ec;
  this.breakdownVoltage = bv;
  $updateModel(this);
}

function DiodeModel_1(copy){
  this.flags = copy.flags;
  this.saturationCurrent = copy.saturationCurrent;
  this.seriesResistance = copy.seriesResistance;
  this.emissionCoefficient = copy.emissionCoefficient;
  this.breakdownVoltage = copy.breakdownVoltage;
  this.forwardCurrent = copy.forwardCurrent;
  $updateModel(this);
}

function addDefaultModel(name_0, dm){
  $putStringValue(modelMap, name_0, dm);
  dm.builtIn = true;
  dm.name_0 = name_0;
}

function createModelMap(){
  if (modelMap)
    return;
  modelMap = new HashMap;
  addDefaultModel('spice-default', new DiodeModel_0(1.0E-14, 0, 1, 0));
  addDefaultModel('default', new DiodeModel_0($intern_26, 0, 2, 0));
  addDefaultModel('default-zener', new DiodeModel_0($intern_26, 0, 2, 5.6));
  addDefaultModel('old-default-led', $setInternal(new DiodeModel_0(2.2349907006671927E-18, 0, 2, 0)));
  addDefaultModel('default-led', new DiodeModel_0(9.32E-11, 0.042, 3.73, 0));
  addDefaultModel('default-optocoupler-led', new DiodeModel_0(1.714E-7, 0, 4.077, 0));
  addDefaultModel('1N5711', new DiodeModel_0(3.15E-7, 2.8, 2.03, 70));
  addDefaultModel('1N5712', new DiodeModel_0(6.8E-10, 12, 1.003, 20));
  addDefaultModel('BAT85', new DiodeModel_0(2.076E-7, 2.326, 1.023, 33));
  addDefaultModel('1N34', $setInternal(new DiodeModel_0(2.0E-10, 0.084, 2.19, 60)));
  addDefaultModel('1N4004', new DiodeModel_0(1.88E-8, 0.0286, 2, 400));
  addDefaultModel('1N4148', new DiodeModel_0(4.352E-9, 0.6458, 1.906, 75));
  addDefaultModel('x2n2646-emitter', $setInternal(new DiodeModel_0(2.13E-11, 0, 1.8, 0)));
  loadInternalModel('~tl431ed-d_ed 0 1e-14 5 1 0 0');
  loadInternalModel('~lm317-dz 0 1e-14 0 1 6.3 0');
}

function getModelWithName(name_0){
  var lm;
  createModelMap();
  lm = castTo($getStringValue(modelMap, name_0), 19);
  if (lm)
    return lm;
  lm = new DiodeModel;
  lm.name_0 = name_0;
  $putStringValue(modelMap, name_0, lm);
  return lm;
}

function getModelWithNameOrCopy(name_0, oldmodel){
  var lm;
  createModelMap();
  lm = castTo($getStringValue(modelMap, name_0), 19);
  if (lm)
    return lm;
  if (!oldmodel) {
    console.log('model not found: ' + name_0);
    return getModelWithName('default');
  }
  lm = new DiodeModel_1(oldmodel);
  lm.name_0 = name_0;
  $putStringValue(modelMap, name_0, lm);
  return lm;
}

function getModelWithParameters(fwdrop, zvoltage){
  var dm, dm0, it, leakage, name_0, pair;
  createModelMap();
  it = new AbstractHashMap$EntrySetIterator((new AbstractHashMap$EntrySet(modelMap)).this$01);
  while (it.hasNext) {
    pair = $next(it);
    dm0 = castTo(pair.getValue(), 19);
    if ($wnd.Math.abs(dm0.fwdrop - fwdrop) < $intern_27 && dm0.seriesResistance == 0 && $wnd.Math.abs(dm0.breakdownVoltage - zvoltage) < $intern_27 && dm0.emissionCoefficient == 2)
      return dm0;
  }
  leakage = 1 / ($wnd.Math.exp(fwdrop * 19.331142470520007) - 1);
  name_0 = 'fwdrop=' + fwdrop;
  zvoltage != 0 && (name_0 = name_0 + ' zvoltage=' + zvoltage);
  dm = getModelWithName(name_0);
  dm.saturationCurrent = leakage;
  dm.emissionCoefficient = 2;
  dm.breakdownVoltage = zvoltage;
  $updateModel(dm);
  return dm;
}

function loadInternalModel(s){
  var dm, st, name_0, dm_0;
  st = new StringTokenizer(s);
  dm = (name_0 = unescape_0($nextToken(st)) , dm_0 = getModelWithName(name_0) , $undump(dm_0, st) , dm_0);
  dm.builtIn = dm.internal = true;
}

defineClass(19, 1, {19:1, 6:1, 98:1}, DiodeModel, DiodeModel_0, DiodeModel_1);
_.breakdownVoltage = 0;
_.builtIn = false;
_.emissionCoefficient = 0;
_.flags = 0;
_.forwardCurrent = 0;
_.fwdrop = 0;
_.internal = false;
_.saturationCurrent = 0;
_.seriesResistance = 0;
_.vdcoef = 0;
_.vscale = 0;
var modelMap;
var Lcom_lushprojects_circuitjs1_client_DiodeModel_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'DiodeModel', 19);
function configure(old, fresh){
  var a, b;
  old.flags = fresh.flags;
  configure_2(old, fresh);
  configure_0(old, fresh);
  configure_1(old, fresh);
  if (instanceOf(old, 20) && !instanceOf(old, 32)) {
    a = castTo(old, 20);
    b = castTo(fresh, 20);
    a.frequency != b.frequency && (a.freqTimeZero = b.frequency == 0?0:sim.t - a.frequency * (sim.t - a.freqTimeZero) / b.frequency);
  }
  if (instanceOf(old, 84)) {
    a = castTo(old, 84);
    b = castTo(fresh, 84);
    a.resistance = b.resistance;
  }
  if (instanceOf(old, 50)) {
    a = castTo(old, 50);
    b = castTo(fresh, 50);
    a.capacitance = b.capacitance;
    a.initialVoltage = b.initialVoltage;
  }
  if (instanceOf(old, 85)) {
    a = castTo(old, 85);
    b = castTo(fresh, 85);
    a.maxNegativeVoltage = b.maxNegativeVoltage;
  }
  if (instanceOf(old, 20)) {
    a = castTo(old, 20);
    b = castTo(fresh, 20);
    a.waveform = b.waveform;
    a.frequency = b.frequency;
    a.maxVoltage = b.maxVoltage;
    a.bias = b.bias;
    a.phaseShift = b.phaseShift;
    a.dutyCycle = b.dutyCycle;
    a.riseTime = b.riseTime;
  }
  if (instanceOf(old, 32)) {
    a = castTo(old, 32);
    b = castTo(fresh, 32);
    a.sliderText = b.sliderText;
  }
  if (instanceOf(old, 46)) {
    a = castTo(old, 46);
    b = castTo(fresh, 46);
    a.currentValue = b.currentValue;
    a.maxVoltage = b.maxVoltage;
  }
  if (instanceOf(old, 52)) {
    a = castTo(old, 52);
    b = castTo(fresh, 52);
    a.position = b.position;
    a.maxResistance = b.maxResistance;
    a.sliderText = b.sliderText;
  }
  if (instanceOf(old, 21)) {
    a = castTo(old, 21);
    b = castTo(fresh, 21);
    a.position = b.position;
    a.resistance = b.resistance;
    a.momentary = b.momentary;
    a.label_0 = b.label_0;
    if (instanceOf(a, 39)) {
      castTo(a, 39).throwCount = castTo(b, 39).throwCount;
      castTo(a, 39).link_0 = castTo(b, 39).link_0;
    }
    instanceOf(a, 78) && (castTo(a, 78).poleCount = castTo(b, 78).poleCount);
    instanceOf(a, 55) && (castTo(a, 55).link_0 = castTo(b, 55).link_0);
    $allocNodes(a);
  }
  if (instanceOf(old, 40)) {
    a = castTo(old, 40);
    b = castTo(fresh, 40);
    a.hiV = b.hiV;
    a.loV = b.loV;
  }
  if (instanceOf(old, 89)) {
    a = castTo(old, 89);
    b = castTo(fresh, 89);
    a.threshold = b.threshold;
  }
  if (instanceOf(old, 92)) {
    a = castTo(old, 92);
    b = castTo(fresh, 92);
    a.maxOut = b.maxOut;
    a.minOut = b.minOut;
    a.gain = b.gain;
    a.gbw = b.gbw;
  }
  if (instanceOf(old, 49)) {
    a = castTo(old, 49);
    b = castTo(fresh, 49);
    a.r_on = b.r_on;
    a.r_off = b.r_off;
    a.threshold = b.threshold;
  }
  if (instanceOf(old, 47)) {
    a = castTo(old, 47);
    b = castTo(fresh, 47);
    a.beta_0 = b.beta_0;
    a.modelName = b.modelName;
  }
  if (instanceOf(old, 51)) {
    a = castTo(old, 51);
    b = castTo(fresh, 51);
    a.vt = b.vt;
    a.beta_0 = b.beta_0;
    globalFlags = globalFlags;
    $allocNodes(a);
  }
  if (instanceOf(old, 24)) {
    a = castTo(old, 24);
    b = castTo(fresh, 24);
    a.highVoltage = b.highVoltage;
    a.propagationDelay = b.propagationDelay;
    if (a.inputCount != b.inputCount) {
      a.inputCount = b.inputCount;
      $allocNodes(a);
      $setupVolts(a);
    }
  }
  if (instanceOf(old, 88)) {
    a = castTo(old, 88);
    b = castTo(fresh, 88);
    a.slewRate = b.slewRate;
    a.highVoltage = b.highVoltage;
  }
  if (instanceOf(old, 18)) {
    a = castTo(old, 18);
    b = castTo(fresh, 18);
    a.highVoltage = b.highVoltage;
  }
  if (instanceOf(old, 91)) {
    a = castTo(old, 91);
    b = castTo(fresh, 91);
    a.modulus = b.modulus;
    a.invertreset = b.invertreset;
  }
  if (instanceOf(old, 86)) {
    a = castTo(old, 86);
    b = castTo(fresh, 86);
    a.inductance = b.inductance;
    a.ratio = b.ratio;
    a.couplingCoef = b.couplingCoef;
    a.saturationCurrent = b.saturationCurrent;
  }
  if (instanceOf(old, 90)) {
    a = castTo(old, 90);
    b = castTo(fresh, 90);
    a.inductance = b.inductance;
    a.ratio = b.ratio;
    a.couplingCoef = b.couplingCoef;
  }
  if (instanceOf(old, 53)) {
    a = castTo(old, 53);
    b = castTo(fresh, 53);
    a.inductance = b.inductance;
    a.couplingCoef = b.couplingCoef;
    a.description = b.description;
  }
  if (instanceOf(old, 59)) {
    a = castTo(old, 59);
    b = castTo(fresh, 59);
    a.nom_pow = b.nom_pow;
    a.nom_v = b.nom_v;
    a.warmTime = b.warmTime;
    a.coolTime = b.coolTime;
  }
  if (instanceOf(old, 43)) {
    a = castTo(old, 43);
    b = castTo(fresh, 43);
    a.resistance = b.resistance;
    a.inductance = b.inductance;
    a.K = b.K;
    a.Kb = b.Kb;
    a.J = b.J;
    a.b = b.b;
    a.gearRatio = b.gearRatio;
    a.tau = b.tau;
  }
  if (instanceOf(old, 65)) {
    a = castTo(old, 65);
    b = castTo(fresh, 65);
    a.Rs = b.Rs;
    a.Rr = b.Rr;
    a.Ls = b.Ls;
    a.Lr = b.Lr;
    a.Lm = b.Lm;
    a.b = b.b;
    a.J = b.J;
  }
  if (instanceOf(old, 60)) {
    a = castTo(old, 60);
    b = castTo(fresh, 60);
    a.meter = b.meter;
    a.resistance = b.resistance;
  }
  if (instanceOf(old, 61)) {
    a = castTo(old, 61);
    b = castTo(fresh, 61);
    a.meter = b.meter;
    a.label_0 = b.label_0;
  }
  if (instanceOf(old, 62)) {
    a = castTo(old, 62);
    b = castTo(fresh, 62);
    a.meter = b.meter;
  }
  if (instanceOf(old, 63)) {
    a = castTo(old, 63);
    b = castTo(fresh, 63);
    a.meter = b.meter;
  }
  if (instanceOf(old, 64)) {
    a = castTo(old, 64);
    b = castTo(fresh, 64);
    a.displayMode = b.displayMode;
  }
  if (instanceOf(old, 37)) {
    a = castTo(old, 37);
    b = castTo(fresh, 37);
    a.threshold = b.threshold;
    a.lookupText = b.lookupText;
  }
  if (instanceOf(old, 31)) {
    a = castTo(old, 31);
    b = castTo(fresh, 31);
    a.triggerVoltage = b.triggerVoltage;
    a.delay = b.delay;
    a.type_0 = b.type_0;
  }
  if (instanceOf(old, 79)) {
    a = castTo(old, 79);
    b = castTo(fresh, 79);
    a.maxBrightnessCurrent = b.maxBrightnessCurrent;
    a.colorR = b.colorR;
    a.colorG = b.colorG;
    a.colorB = b.colorB;
  }
  if (instanceOf(old, 80)) {
    a = castTo(old, 80);
    b = castTo(fresh, 80);
    a.inductance = b.inductance;
    a.initialCurrent = b.initialCurrent;
    a.saturationCurrent = b.saturationCurrent;
    $setup_2(a.ind, a.inductance, a.current_1, a.flags, a.saturationCurrent);
  }
  if (instanceOf(old, 43)) {
    a = castTo(old, 43);
    $setup_1(a.ind, a.inductance, a.coilCurrent, 2);
    $setup_1(a.indInertia, a.J, a.inertiaCurrent, 2);
  }
  instanceOf(old, 53) && $parseDescription(castTo(old, 53));
  if (instanceOf(old, 26)) {
    a = castTo(old, 26);
    b = castTo(fresh, 26);
    a.modelName = b.modelName;
    $setup_0(a);
  }
  if (instanceOf(old, 47)) {
    a = castTo(old, 47);
    $setup_3(a);
    a.model.junctionCapBE == 0 && a.model.transitTimeF == 0 && (a.geqBE = a.ceqBE = a.capCurBE = 0);
    a.model.junctionCapBC == 0 && a.model.transitTimeR == 0 && (a.geqBC = a.ceqBC = a.capCurBC = 0);
  }
  instanceOf(old, 37) && $parseEntries(castTo(old, 37));
  if (instanceOf(old, 54)) {
    a = castTo(old, 54);
    b = castTo(fresh, 54);
    if (a.delay != b.delay) {
      a.delay = b.delay;
      $reset_6(a);
    }
    a.imped = b.imped;
  }
  if (instanceOf(old, 42)) {
    a = castTo(old, 42);
    b = castTo(fresh, 42);
    if (a.dataCount != b.dataCount) {
      a.dataCount = b.dataCount;
      a.data_0 = b.data_0;
      a.dataPtr = 0;
      a.dataFull = false;
    }
  }
  if (instanceOf(old, 28)) {
    a = castTo(old, 28);
    b = castTo(fresh, 28);
    if (a.duration != b.duration || a.samplingRate != b.samplingRate) {
      a.duration = b.duration;
      a.samplingRate = b.samplingRate;
      a.dataCount = b.dataCount;
      a.data_0 = b.data_0;
      a.sampleStep = b.sampleStep;
      $reset_0(a);
      initialize(a);
    }
  }
}

function construct(f, x_0, y_0, x2, y2, flags){
  var args, bv, color_0, custom, end, i, led, model, n, name_0, rs, sc, tokens, type_0;
  type_0 = f[0];
  if (!($equals_0(type_0, 'd') || $equals_0(type_0, 'z') || $equals_0(type_0, '162')) || flags != 2)
    return null;
  led = $equals_0(type_0, '162');
  require(f.length >= 7, 'Missing diode model');
  custom = $equals_0(f[6], 'custom');
  end = custom?11:7;
  require(f.length == end + (led?4:0), 'Invalid diode field count');
  name_0 = f[6];
  createModelMap();
  if (custom) {
    positive(f, stampJavaTypeInfo(getClassLiteralForArray(I_classLit, 1), $intern_12, 5, 15, [7, 9]));
    sc = number_0(f, 7);
    rs = number_0(f, 8);
    n = number_0(f, 9);
    bv = number_0(f, 10);
    require(rs >= 0 && bv >= 0 && (rs == 0 || !isNaN(1 / rs) && !(!isNaN(1 / rs) && !isFinite(1 / rs))) && !isNaN(1 / (n * $intern_23)) && !(!isNaN(1 / (n * $intern_23)) && !isFinite(1 / (n * $intern_23))) && finite_0($wnd.Math.log(1 / sc + 1) * n * $intern_23), 'Invalid custom diode model');
    name_0 = '~react-diode:' + f[7] + ':' + f[8] + ':' + f[9] + ':' + f[10];
    model = new DiodeModel_0(sc, rs, n, bv);
    model.name_0 = name_0;
    $putStringValue(modelMap, name_0, model);
  }
   else {
    model = castTo($getStringValue(modelMap, name_0), 19);
    require(!!model && model.builtIn && !model.internal, 'Unknown diode model');
  }
  require(!$equals_0(type_0, 'z') || model.breakdownVoltage > 0, 'Zener requires breakdown voltage');
  args = name_0;
  if (led) {
    for (i = end; i < end + 3; i++) {
      color_0 = number_0(f, i);
      require(color_0 >= 0 && color_0 <= 1, 'Invalid LED color');
      args += ' ' + f[i];
    }
    positive(f, stampJavaTypeInfo(getClassLiteralForArray(I_classLit, 1), $intern_12, 5, 15, [end + 3]));
    args += ' ' + f[end + 3];
  }
  tokens = new StringTokenizer(args);
  return led?new LEDElm(x_0, y_0, x2, y2, 2, tokens):$equals_0(type_0, 'z')?new ZenerElm(x_0, y_0, x2, y2, 2, tokens):new DiodeElm(x_0, y_0, x2, y2, 2, tokens);
}

function $appendElement(result, id_0, type_0, current, volts){
  result.elements.push({id:id_0, type:type_0, current:current, voltages:Array.prototype.slice.call(volts)});
}

function $appendMeasurements(result, id_0, values){
  Object.keys(values).length && (result.elements[id_0].measurements = values);
}

function $checkStopped(this$static){
  if (this$static.app.stopMessage != null)
    throw toJs(new IllegalStateException(this$static.app.stopMessage));
}

function $load(this$static, text_0, timeStep){
  var element, element$iterator, element$iterator0, elements;
  elements = $parse(text_0, timeStep);
  this$static.app.elmList = elements;
  $resetTime(this$static.app.sim);
  this$static.app.sim.matrices = null;
  this$static.app.sim.maxTimeStep = this$static.app.sim.minTimeStep = this$static.app.sim.timeStep_0 = timeStep;
  for (element$iterator0 = new ArrayList$1(elements.arrayList); element$iterator0.i < element$iterator0.this$01.array.length;) {
    element = castTo($next_0(element$iterator0), 4);
    instanceOf(element, 54) && element.reset_0();
  }
  for (element$iterator = new ArrayList$1(elements.arrayList); element$iterator.i < element$iterator.this$01.array.length;) {
    element = castTo($next_0(element$iterator), 4);
    instanceOf(element, 41) && (castTo(element, 41).lasttime = sim.t);
    initialize(element);
  }
  this$static.app.sim.adjustTimeStep = false;
  this$static.app.sim.lastIterTime = 0;
  $analyzeCircuit(this$static.app.sim);
  $preStampAndStampCircuit(this$static.app.sim);
  this$static.loadedText = text_0;
  this$static.loadedTimeStep = timeStep;
  $checkStopped(this$static);
}

function $newSnapshot(time, timeStep, error, editorFree){
  return {time:time, timeStep:timeStep, error:error, editorFree:editorFree, elements:[]};
}

function $onModuleLoad(this$static){
  localizationMap = new HashMap;
  this$static.app = new CirSim;
  this$static.app.gridSize = 16;
  this$static.app.gridMask = ~(this$static.app.gridSize - 1);
  this$static.app.gridRound = (this$static.app.gridSize / 2 | 0) - 1;
  this$static.app.random = new Random;
  this$static.app.elmList = new Vector;
  initSimulationClass(this$static.app, this$static.app.sim);
  $publish(this$static);
}

function $parse(text_0, timeStep){
  var a, a$index, a$max, analog, b, b$index, b$max, base, capacitor, chip, chipFlags, countOk, delay, det, determinant, diodeModel, display, e, elements, elm, expected, extraVoltage, fet, fields, flags, gate, half, hv, i, i0, i1, impedance, k, l, l2, line, lines, modulus, mutual, n, nextChip, nextChipFlags, output, parameters, passive, passiveModel, pos, product, q, qn, ratio, scale, semiconductor, signal, source, state, steps, switchModel, ternary, tokens, transistorModel, turn, turn$index, turn$max, turns, type_0, value_0, voltage, winding, windingIndex, windings, x1, x2, y1, y2;
  if (text_0 == null || !(!isNaN(timeStep) && !(!isNaN(timeStep) && !isFinite(timeStep))) || timeStep <= 0)
    throw toJs(new IllegalArgumentException('Circuit text and a positive finite timestep are required'));
  elements = new Vector;
  lines = $split(text_0, '\\r?\\n', 0);
  for (line = 0; line < lines.length; line++) {
    value_0 = $trim(lines[line]);
    if (value_0.length == 0)
      continue;
    try {
      fields = $split(value_0, '\\s+', 0);
      if (fields.length < 6)
        throw toJs(new IllegalArgumentException('Expected type, endpoints, and flags'));
      type_0 = fields[0];
      x1 = __parseAndValidateInt(fields[1], 10);
      y1 = __parseAndValidateInt(fields[2], 10);
      x2 = __parseAndValidateInt(fields[3], 10);
      y2 = __parseAndValidateInt(fields[4], 10);
      flags = __parseAndValidateInt(fields[5], 10);
      if (x1 == x2 && y1 == y2)
        throw toJs(new IllegalArgumentException('Zero-length elements are unsupported'));
      switchModel = construct_4(fields, x1, y1, x2, y2, flags);
      if (switchModel) {
        switchModel.setPoints();
        $add(elements.arrayList, switchModel);
        continue;
      }
      transistorModel = construct_5(fields, x1, y1, x2, y2, flags);
      if (transistorModel) {
        $setPoints_13(transistorModel);
        $add(elements.arrayList, transistorModel);
        continue;
      }
      diodeModel = construct(fields, x1, y1, x2, y2, flags);
      if (diodeModel) {
        diodeModel.setPoints();
        $add(elements.arrayList, diodeModel);
        continue;
      }
      signal = construct_3(fields, x1, y1, x2, y2, flags, timeStep);
      if (signal) {
        signal.setPoints();
        $add(elements.arrayList, signal);
        continue;
      }
      passiveModel = construct_1(fields, x1, y1, x2, y2, flags, timeStep);
      if (passiveModel) {
        passiveModel.setPoints();
        $add(elements.arrayList, passiveModel);
        continue;
      }
      semiconductor = construct_2(fields, x1, y1, x2, y2, flags, timeStep);
      if (semiconductor) {
        semiconductor.setPoints();
        $add(elements.arrayList, semiconductor);
        continue;
      }
      output = construct_0(fields, timeStep);
      if (output) {
        output.setPoints();
        $add(elements.arrayList, output);
        continue;
      }
      voltage = $equals_0(type_0, 'v') || $equals_0(type_0, 'R');
      analog = $equals_0(type_0, '159') || $equals_0(type_0, '160');
      capacitor = $equals_0(type_0, 'c') || $equals_0(type_0, '209');
      gate = $equals_0(type_0, '150') || $equals_0(type_0, '151') || $equals_0(type_0, '152') || $equals_0(type_0, '153') || $equals_0(type_0, '154') || $equals_0(type_0, '431');
      fet = $equals_0(type_0, 'f') || $equals_0(type_0, 'j');
      display = $equals_0(type_0, 'O') || $equals_0(type_0, 'L') || $equals_0(type_0, 'M');
      chip = $equals_0(type_0, '155') || $equals_0(type_0, '156') || $equals_0(type_0, '193');
      expected = analog?9:$equals_0(type_0, '209')?10:$equals_0(type_0, 'T')?12:$equals_0(type_0, 'S')?10:$equals_0(type_0, '429')?9:$equals_0(type_0, '162')?11:$equals_0(type_0, 'z')?8:gate?10:$equals_0(type_0, 't')?10:fet || $equals_0(type_0, 'I')?8:$equals_0(type_0, 'r')?7:$equals_0(type_0, 'c')?9:$equals_0(type_0, '174')?9:$equals_0(type_0, 'i')?8:$equals_0(type_0, 'l')?10:$equals_0(type_0, 's')?8:voltage || $equals_0(type_0, 'a')?12:$equals_0(type_0, 'w') || $equals_0(type_0, 'g') || $equals_0(type_0, 'd')?6:-1;
      passive = $equals_0(type_0, '169') || $equals_0(type_0, '406') || $equals_0(type_0, '171') || $equals_0(type_0, '416');
      nextChip = $equals_0(type_0, '164') || $equals_0(type_0, '168') || $equals_0(type_0, '195') || $equals_0(type_0, '196');
      extraVoltage = (flags & 8192) != 0?1:0;
      countOk = passive?fields.length == ($equals_0(type_0, '169')?12:$equals_0(type_0, '406')?13:$equals_0(type_0, '171')?10:9):nextChip?fields.length == ($equals_0(type_0, '164')?13:$equals_0(type_0, '168')?11:$equals_0(type_0, '195')?6:7) + extraVoltage:chip?fields.length == ((flags & 8192) != 0?9:8):display?$equals_0(type_0, 'L')?fields.length == 8 || fields.length == 10:fields.length == 6 || fields.length == 7:gate?fields.length == 9 || fields.length == 10:fields.length == expected;
      if (!countOk)
        throw toJs(new IllegalArgumentException('Unsupported type or field count: ' + type_0));
      chipFlags = flags & -8193;
      nextChipFlags = $equals_0(type_0, '164')?chipFlags == 0 || chipFlags == 8:$equals_0(type_0, '168')?chipFlags == 2 || chipFlags == 6:$equals_0(type_0, '196')?chipFlags == 2:chipFlags == 0;
      if (nextChip && !nextChipFlags)
        throw toJs(new IllegalArgumentException('Unsupported chip flags'));
      if (flags != 0 && !(gate && (flags == 2 || flags == 4 || flags == 6)) && !(passive && ($equals_0(type_0, '169') || $equals_0(type_0, '406')) && flags == 2) && !(nextChip && nextChipFlags) && !(chip && ($equals_0(type_0, '156')?flags == 4 || flags == 8192 || flags == 8196:flags == 8192)) && !(analog && flags >= 0 && flags <= 3) && !(display && flags >= 0 && flags <= ($equals_0(type_0, 'M')?7:3)) && !(($equals_0(type_0, 'S') || $equals_0(type_0, '162') || $equals_0(type_0, 'z')) && flags == 1) && !($equals_0(type_0, 'T') && flags == 2) && !(fet && ($equals_0(type_0, 'f')?flags >= 0 && flags <= 255:flags == 1)) && !((capacitor || $equals_0(type_0, 'l')) && flags == 2) && !($equals_0(type_0, 'a') && flags == 8) && !(voltage && flags == 4 && $equals_0(fields[6], '5')))
        throw toJs(new IllegalArgumentException('Unsupported flags'));
      for (i0 = 6; i0 < fields.length; i0++)
        if (!($equals_0(type_0, '406') && i0 == 8) && !($equals_0(type_0, '416') && i0 == 7) && !($equals_0(type_0, '164') && i0 == fields.length - 2) && !(($equals_0(type_0, 's') || $equals_0(type_0, 'S') || $equals_0(type_0, '429')) && i0 == 7) && !($equals_0(type_0, 'L') && i0 == 7) && !($equals_0(type_0, '174') && i0 == 8) && !finite(__parseAndValidateDouble(fields[i0])))
          throw toJs(new IllegalArgumentException('Non-finite parameter'));
      if (($equals_0(type_0, 'r') || capacitor || $equals_0(type_0, 'l')) && __parseAndValidateDouble(fields[6]) <= 0)
        throw toJs(new IllegalArgumentException('Resistance/capacitance must be positive'));
      if ($equals_0(type_0, '209') && __parseAndValidateDouble(fields[9]) < 0)
        throw toJs(new IllegalArgumentException('Maximum reverse voltage must be nonnegative'));
      if (passive) {
        if (y1 != 32 || y2 != 32 || x2 - x1 != 64)
          throw toJs(new IllegalArgumentException('Invalid passive model geometry'));
        if ($equals_0(type_0, '416') && (__parseAndValidateInt(fields[6], 10) < 0 || __parseAndValidateInt(fields[6], 10) > 3 || !$equals_0(fields[7], 'false') || !$equals_0(fields[8], '0')))
          throw toJs(new IllegalArgumentException('Invalid MBB switch state or link'));
        if ($equals_0(type_0, '171')) {
          delay = __parseAndValidateDouble(fields[6]);
          impedance = __parseAndValidateDouble(fields[7]);
          steps = $wnd.Math.floor(delay / timeStep);
          if (delay <= 0 || impedance <= 0 || !(!isNaN(1 / impedance) && !(!isNaN(1 / impedance) && !isFinite(1 / impedance))) || steps < 1 || steps > $intern_28 || !$equals_0(fields[8], '32') || __parseAndValidateDouble(fields[9]) != 0)
            throw toJs(new IllegalArgumentException('Invalid transmission line delay, impedance, width or losses'));
        }
        if ($equals_0(type_0, '169')) {
          l = __parseAndValidateDouble(fields[6]);
          ratio = __parseAndValidateDouble(fields[7]);
          k = __parseAndValidateDouble(fields[11]);
          l2 = l * ratio * ratio / 4;
          mutual = k * $wnd.Math.sqrt(l * l2);
          det = l * (l2 + k * l2) - 2 * mutual * mutual;
          if (l <= 0 || ratio <= 0 || k <= 0 || k >= 1 || !(!isNaN(det) && !(!isNaN(det) && !isFinite(det))) || det <= 0 || !(!isNaN(1 / det) && !(!isNaN(1 / det) && !isFinite(1 / det))) || !(!isNaN((l * l2 - mutual * mutual) / (l2 - k * l2)) && !(!isNaN((l * l2 - mutual * mutual) / (l2 - k * l2)) && !isFinite((l * l2 - mutual * mutual) / (l2 - k * l2)))) || __parseAndValidateDouble(fields[8]) != 0 || __parseAndValidateDouble(fields[9]) != 0 || __parseAndValidateDouble(fields[10]) != 0)
            throw toJs(new IllegalArgumentException('Invalid tapped transformer parameters'));
        }
        if ($equals_0(type_0, '406')) {
          l = __parseAndValidateDouble(fields[6]);
          k = __parseAndValidateDouble(fields[7]);
          turns = $split(fields[8], '[:,]', -1);
          if (turns.length != 3 || $indexOf_0(fields[8], fromCodePoint(43)) >= 0 || $indexOf_0(fields[8], fromCodePoint(44)) < 0 || $indexOf_0(fields[8], fromCodePoint(58)) < $indexOf_0(fields[8], fromCodePoint(44)) || !$equals_0(fields[9], '3'))
            throw toJs(new IllegalArgumentException('Custom transformer requires two primary and one secondary winding'));
          product = 1;
          windings = initUnidimensionalArray(D_classLit, $intern_7, 5, 3, 15, 1);
          windingIndex = 0;
          for (turn$index = 0 , turn$max = turns.length; turn$index < turn$max; ++turn$index) {
            turn = turns[turn$index];
            n = __parseAndValidateDouble(turn);
            winding = n * n * l;
            if (!(!isNaN(n) && !(!isNaN(n) && !isFinite(n))) || n == 0 || !(!isNaN(winding) && !(!isNaN(winding) && !isFinite(winding))) || winding <= 0)
              throw toJs(new IllegalArgumentException('Invalid winding turns'));
            windings[windingIndex++] = winding;
            product *= winding;
          }
          for (a$index = 0 , a$max = windings.length; a$index < a$max; ++a$index) {
            a = windings[a$index];
            for (b$index = 0 , b$max = windings.length; b$index < b$max; ++b$index) {
              b = windings[b$index];
              if (!(!isNaN(a * b) && !(!isNaN(a * b) && !isFinite(a * b))) || a * b <= 0)
                throw toJs(new IllegalArgumentException('Invalid mutual inductance range'));
            }
          }
          det = product * (1 - k) * (1 - k) * (1 + 2 * k);
          if (l <= 0 || k <= 0 || k >= 1 || !(!isNaN(det) && !(!isNaN(det) && !isFinite(det))) || det <= 0 || !(!isNaN(1 / det) && !(!isNaN(1 / det) && !isFinite(1 / det))) || __parseAndValidateDouble(fields[10]) != 0 || __parseAndValidateDouble(fields[11]) != 0 || __parseAndValidateDouble(fields[12]) != 0)
            throw toJs(new IllegalArgumentException('Invalid custom transformer parameters'));
        }
      }
      if (nextChip) {
        half = $equals_0(type_0, '195');
        base = half?6:7;
        hv = extraVoltage != 0?__parseAndValidateDouble(fields[base]):5;
        base += extraVoltage;
        if (!half && !$equals_0(fields[6], '4') || hv <= 0 || !(!isNaN(hv) && !(!isNaN(hv) && !isFinite(hv))) || y1 != y2 || x2 - x1 != 64)
          throw toJs(new IllegalArgumentException('Invalid chip size, geometry or logic voltage'));
        if ($equals_0(type_0, '164') || $equals_0(type_0, '168'))
          for (i1 = 0; i1 < 4; i1++) {
            state = __parseAndValidateDouble(fields[base + i1]);
            if (state != 0 && state != hv)
              throw toJs(new IllegalArgumentException('Invalid stored chip output'));
          }
        if ($equals_0(type_0, '164')) {
          modulus = __parseAndValidateInt(fields[fields.length - 1], 10);
          if (!($equals_0(fields[fields.length - 2], 'true') || $equals_0(fields[fields.length - 2], 'false')) || modulus < 0 || modulus > 16)
            throw toJs(new IllegalArgumentException('Invalid counter reset polarity or modulus'));
        }
      }
      if (chip) {
        base = (flags & 8192) != 0?7:6;
        hv = (flags & 8192) != 0?__parseAndValidateDouble(fields[6]):5;
        q = __parseAndValidateDouble(fields[base]);
        qn = __parseAndValidateDouble(fields[base + 1]);
        if (!(!isNaN(hv) && !(!isNaN(hv) && !isFinite(hv))) || hv <= 0 || y1 != y2 || x2 - x1 != 64 || !(q == 0 && qn == hv || q == hv && qn == 0))
          throw toJs(new IllegalArgumentException('Invalid flip-flop geometry, logic voltage or stored output state'));
      }
      if (analog && (__parseAndValidateDouble(fields[6]) <= 0 || __parseAndValidateDouble(fields[7]) <= 0 || !finite(1 / __parseAndValidateDouble(fields[6])) || !finite(1 / __parseAndValidateDouble(fields[7])) || y1 != y2 || x2 - x1 != 64))
        throw toJs(new IllegalArgumentException('Invalid analog switch resistance or geometry'));
      if ($equals_0(type_0, 'S') || $equals_0(type_0, '429')) {
        pos = __parseAndValidateInt(fields[6], 10);
        if (pos < 0 || pos > ($equals_0(type_0, 'S')?2:1) || !$equals_0(fields[7], 'false') || y1 != y2 || x2 - x1 != 64 || ($equals_0(type_0, 'S')?flags != 1 || !$equals_0(fields[8], '0') || !$equals_0(fields[9], '2'):!$equals_0(fields[8], '2')))
          throw toJs(new IllegalArgumentException('Invalid multipole switch parameters or geometry'));
      }
      if ($equals_0(type_0, '162') || $equals_0(type_0, 'z')) {
        if (flags != 1 || __parseAndValidateDouble(fields[6]) <= 0 || ($equals_0(type_0, 'z')?__parseAndValidateDouble(fields[7]) <= 0:!$equals_0(fields[7], '1') || !$equals_0(fields[8], '0') || !$equals_0(fields[9], '0') || __parseAndValidateDouble(fields[10]) <= 0))
          throw toJs(new IllegalArgumentException('Invalid LED/Zener parameters'));
      }
      if ($equals_0(type_0, 'T')) {
        l = __parseAndValidateDouble(fields[6]);
        ratio = __parseAndValidateDouble(fields[7]);
        k = __parseAndValidateDouble(fields[10]);
        l2 = l * ratio * ratio;
        mutual = k * $wnd.Math.sqrt(l * l2);
        determinant = l * l2 - mutual * mutual;
        if (l <= 0 || ratio <= 0 || k <= 0 || k >= 1 || !(!isNaN(determinant) && !(!isNaN(determinant) && !isFinite(determinant))) || determinant <= 0 || !(!isNaN(1 / determinant) && !(!isNaN(1 / determinant) && !isFinite(1 / determinant))) || __parseAndValidateDouble(fields[8]) != 0 || __parseAndValidateDouble(fields[9]) != 0 || __parseAndValidateDouble(fields[11]) != 0 || x2 - x1 != 64 || y1 != 32 || y2 != 64)
          throw toJs(new IllegalArgumentException('Invalid linear transformer parameters or geometry'));
      }
      if ((gate || $equals_0(type_0, 't') || fet) && (y1 != y2 || x2 - x1 != 64))
        throw toJs(new IllegalArgumentException('Model requires horizontal synthetic geometry'));
      if (gate && (__parseAndValidateInt(fields[6], 10) < 1 || __parseAndValidateInt(fields[6], 10) > 8 || __parseAndValidateDouble(fields[8]) <= 0 || fields.length == 10 && __parseAndValidateDouble(fields[9]) < 0))
        throw toJs(new IllegalArgumentException('Invalid gate input count, logic voltage or delay'));
      if ($equals_0(type_0, 'I') && (__parseAndValidateDouble(fields[6]) <= 0 || __parseAndValidateDouble(fields[7]) <= 0))
        throw toJs(new IllegalArgumentException('Invalid inverter parameters'));
      if (fet && __parseAndValidateDouble(fields[7]) <= 0)
        throw toJs(new IllegalArgumentException('FET beta must be positive'));
      if ($equals_0(type_0, 't') && (!($equals_0(fields[6], '1') || $equals_0(fields[6], '-1')) || __parseAndValidateDouble(fields[9]) <= 0))
        throw toJs(new IllegalArgumentException('Invalid bipolar transistor parameters'));
      if ($equals_0(type_0, 'i') && __parseAndValidateDouble(fields[7]) < 0)
        throw toJs(new IllegalArgumentException('Current-source compliance must be nonnegative'));
      if ($equals_0(type_0, '174') && (__parseAndValidateDouble(fields[6]) <= 0 || __parseAndValidateDouble(fields[7]) < 0 || __parseAndValidateDouble(fields[7]) > 1 || x2 - x1 != 64 || y1 != 32 || y2 != 0 || !$equals_0(fields[8], 'Resistance')))
        throw toJs(new IllegalArgumentException('Invalid potentiometer geometry or parameters'));
      if (voltage && !($equals_0(fields[6], '0') || $equals_0(fields[6], '1') || $equals_0(fields[6], '2') || $equals_0(fields[6], '3') || $equals_0(fields[6], '4') || $equals_0(fields[6], '5')))
        throw toJs(new IllegalArgumentException('Unsupported voltage waveform'));
      if (voltage && (__parseAndValidateDouble(fields[11]) <= 0 || __parseAndValidateDouble(fields[11]) >= 1 || $equals_0(fields[6], '5') && flags != 4))
        throw toJs(new IllegalArgumentException('Expected duty cycle between 0 and 1; pulse requires duty flag'));
      if (voltage && __parseAndValidateDouble(fields[7]) < 0)
        throw toJs(new IllegalArgumentException('Frequency must be nonnegative'));
      if ($equals_0(type_0, 'l') && __parseAndValidateDouble(fields[9]) != 0)
        throw toJs(new IllegalArgumentException('Saturating inductors are not supported yet'));
      if ($equals_0(type_0, 's') && (!($equals_0(fields[6], '0') || $equals_0(fields[6], '1')) || !($equals_0(fields[7], 'false') || $equals_0(fields[7], 'true'))))
        throw toJs(new IllegalArgumentException('Switch requires position 0/1 and boolean momentary'));
      if ($equals_0(type_0, 'O') && fields.length == 7) {
        scale = __parseAndValidateInt(fields[6], 10);
        if (scale < 0 || scale > 3)
          throw toJs(new IllegalArgumentException('Output scale must be auto, V, mV or uV'));
      }
      if ($equals_0(type_0, 'L')) {
        ternary = (flags & 1) != 0;
        pos = __parseAndValidateInt(fields[6], 10);
        if (pos < 0 || pos > (ternary?2:1) || !$equals_0(fields[7], 'false'))
          throw toJs(new IllegalArgumentException('Logic input requires a valid state and momentary=false'));
      }
      if ($equals_0(type_0, 'a') && (flags != 8 || x1 == x2 || y1 != y2 || __parseAndValidateDouble(fields[6]) <= __parseAndValidateDouble(fields[7]) || !finite(__parseAndValidateDouble(fields[6]) - __parseAndValidateDouble(fields[7])) || __parseAndValidateDouble(fields[11]) <= 0))
        throw toJs(new IllegalArgumentException('Op-amp requires horizontal geometry, gain flag, ordered limits and positive gain'));
      parameters = '';
      for (i = 6; i < fields.length; i++)
        parameters += fields[i] + ' ';
      tokens = new StringTokenizer(parameters);
      if ($equals_0(type_0, 'r'))
        elm = new ResistorElm(x1, y1, x2, y2, flags, tokens);
      else if ($equals_0(type_0, '209'))
        elm = new PolarCapacitorElm(x1, y1, x2, y2, flags, tokens);
      else if ($equals_0(type_0, '159'))
        elm = new AnalogSwitchElm(x1, y1, x2, y2, flags, tokens);
      else if ($equals_0(type_0, '160'))
        elm = new AnalogSwitch2Elm(x1, y1, x2, y2, flags, tokens);
      else if ($equals_0(type_0, 'c'))
        elm = new CapacitorElm(x1, y1, x2, y2, flags, tokens);
      else if ($equals_0(type_0, 'v'))
        elm = new VoltageElm(x1, y1, x2, y2, flags, tokens);
      else if ($equals_0(type_0, 'R'))
        elm = new RailElm(x1, y1, x2, y2, flags, tokens);
      else if ($equals_0(type_0, 'i')) {
        source = new CurrentElm(x1, y1, x2, y2, flags, tokens);
        source.currentValue = __parseAndValidateDouble(fields[6]);
        elm = source;
      }
       else 
        $equals_0(type_0, 'T')?(elm = new TransformerElm(x1, y1, x2, y2, flags, tokens)):$equals_0(type_0, 'S')?(elm = new Switch2Elm(x1, y1, x2, y2, flags, tokens)):$equals_0(type_0, '429')?(elm = new DPDTSwitchElm(x1, y1, x2, y2, flags, tokens)):$equals_0(type_0, '162')?(elm = new LEDElm(x1, y1, x2, y2, flags, tokens)):$equals_0(type_0, 'z')?(elm = new ZenerElm(x1, y1, x2, y2, flags, tokens)):$equals_0(type_0, 't')?(elm = new TransistorElm(x1, y1, x2, y2, flags, tokens)):$equals_0(type_0, 'f')?(elm = new MosfetElm(x1, y1, x2, y2, flags, tokens)):$equals_0(type_0, 'j')?(elm = new JfetElm(x1, y1, x2, y2, flags, tokens)):$equals_0(type_0, '150')?(elm = new AndGateElm(x1, y1, x2, y2, flags, tokens)):$equals_0(type_0, '151')?(elm = new NandGateElm(x1, y1, x2, y2, flags, tokens)):$equals_0(type_0, '152')?(elm = new OrGateElm(x1, y1, x2, y2, flags, tokens)):$equals_0(type_0, '153')?(elm = new NorGateElm(x1, y1, x2, y2, flags, tokens)):$equals_0(type_0, '154')?(elm = new XorGateElm(x1, y1, x2, y2, flags, tokens)):$equals_0(type_0, '431')?(elm = new XnorGateElm(x1, y1, x2, y2, flags, tokens)):$equals_0(type_0, 'I')?(elm = new InverterElm(x1, y1, x2, y2, flags, tokens)):$equals_0(type_0, '174')?(elm = new PotElm(x1, y1, x2, y2, flags, tokens)):$equals_0(type_0, 'l')?(elm = new InductorElm(x1, y1, x2, y2, flags, tokens)):$equals_0(type_0, 'd')?(elm = new DiodeElm(x1, y1, x2, y2, flags, tokens)):$equals_0(type_0, 's')?(elm = new SwitchElm(x1, y1, x2, y2, flags, tokens)):$equals_0(type_0, 'O')?(elm = new OutputElm(x1, y1, x2, y2, flags, tokens)):$equals_0(type_0, 'M')?(elm = new LogicOutputElm(x1, y1, x2, y2, flags, tokens)):$equals_0(type_0, 'L')?(elm = new LogicInputElm(x1, y1, x2, y2, flags, tokens)):$equals_0(type_0, '169')?(elm = new TappedTransformerElm(x1, y1, x2, y2, flags, tokens)):$equals_0(type_0, '406')?(elm = new CustomTransformerElm(x1, y1, x2, y2, flags, tokens)):$equals_0(type_0, '171')?(elm = new TransLineElm(x1, y1, x2, y2, flags, tokens)):$equals_0(type_0, '416')?(elm = new MBBSwitchElm(x1, y1, x2, y2, flags, tokens)):$equals_0(type_0, '164')?(elm = new CounterElm(x1, y1, x2, y2, flags, tokens)):$equals_0(type_0, '168')?(elm = new LatchElm(x1, y1, x2, y2, flags, tokens)):$equals_0(type_0, '195')?(elm = new HalfAdderElm(x1, y1, x2, y2, flags, tokens)):$equals_0(type_0, '196')?(elm = new FullAdderElm(x1, y1, x2, y2, flags, tokens)):$equals_0(type_0, '155')?(elm = new DFlipFlopElm(x1, y1, x2, y2, flags, tokens)):$equals_0(type_0, '156')?(elm = new JKFlipFlopElm(x1, y1, x2, y2, flags, tokens)):$equals_0(type_0, '193')?(elm = new TFlipFlopElm(x1, y1, x2, y2, flags, tokens)):$equals_0(type_0, 'a')?(elm = new OpAmpElm(x1, y1, x2, y2, flags, tokens)):$equals_0(type_0, 'w')?(elm = new WireElm(x1, y1, x2, y2, flags)):(elm = new GroundElm(x1, y1, x2, y2, flags, tokens));
      gate && fields.length == 10 && (castTo(elm, 24).propagationDelay = __parseAndValidateDouble(fields[9]));
      elm.setPoints();
      $add(elements.arrayList, elm);
    }
     catch ($e0) {
      $e0 = toJava($e0);
      if (instanceOf($e0, 9)) {
        e = $e0;
        throw toJs(new IllegalArgumentException('Line ' + (line + 1) + ': ' + e.getMessage()));
      }
       else 
        throw toJs($e0);
    }
  }
  if (elements.arrayList.array.length == 0)
    throw toJs(new IllegalArgumentException('Circuit must contain elements'));
  return elements;
}

function $publish(this$static){
  var that = this$static;
  $wnd.CircuitEngine = {readCapture:$entry(function(id_0){
    if (!Number.isInteger(id_0))
      throw new Error('Expected integer recorder ID');
    return that.readCapture_0(id_0);
  }
  ), setVariableVoltage:$entry(function(id_0, voltage){
    if (!Number.isInteger(id_0) || typeof voltage !== 'number' || !isFinite(voltage))
      throw new Error('Invalid variable source update');
    that.setVariableVoltage_0(id_0, voltage);
    return that.snapshot_0();
  }
  ), load:$entry(function(text_0, dt){
    that.load_0(text_0, dt);
    return that.snapshot_0();
  }
  ), step:$entry(function(count){
    if (!Number.isInteger(count) || count < 1 || count > 10000)
      throw new Error('Step count must be an integer between 1 and 10000');
    that.step_0(count);
    return that.snapshot_0();
  }
  ), reset:$entry(function(){
    that.reset_0();
    return that.snapshot_0();
  }
  ), updateCircuit:$entry(function(text_0, dt, retained){
    that.updateCircuit_0(text_0, dt, retained);
    return that.snapshot_0();
  }
  ), setContact:$entry(function(id_0, position){
    if (!Number.isInteger(id_0) || !Number.isInteger(position))
      throw new Error('Contact ID and position must be integers');
    that.setContact_0(id_0, position);
    return that.snapshot_0();
  }
  ), setSwitch:$entry(function(id_0, closed_0){
    if (!Number.isInteger(id_0) || typeof closed_0 !== 'boolean')
      throw new Error('Switch ID must be an integer and closed must be boolean');
    that.setSwitch_0(id_0, closed_0);
    return that.snapshot_0();
  }
  ), snapshot:$entry(function(){
    return that.snapshot_0();
  }
  )};
  $wnd.oncircuitengineready && $wnd.oncircuitengineready($wnd.CircuitEngine);
}

function $setContact(this$static, id_0, position){
  var elm, max_0;
  if (id_0 < 0 || id_0 >= this$static.app.elmList.arrayList.array.length || !instanceOf($get_2(this$static.app.elmList, id_0), 21))
    throw toJs(new IllegalArgumentException('Expected switch/input element ID'));
  elm = castTo($get_2(this$static.app.elmList, id_0), 21);
  max_0 = instanceOf(elm, 55)?3:instanceOf(elm, 39)?2:instanceOf(elm, 40) && (castTo(elm, 40).flags & 1) != 0?2:1;
  if (position < 0 || position > max_0)
    throw toJs(new IllegalArgumentException('Invalid contact position'));
  $checkStopped(this$static);
  if (elm.position == position)
    return;
  elm.position = position;
  $analyzeCircuit(this$static.app.sim);
  $preStampAndStampCircuit(this$static.app.sim);
  $checkStopped(this$static);
}

function EngineEntryPoint(){
}

function finite(value_0){
  return !isNaN(value_0) && !(!isNaN(value_0) && !isFinite(value_0));
}

function initializeElement(element){
  instanceOf(element, 41) && (castTo(element, 41).lasttime = sim.t);
  initialize(element);
}

function retainedCount(a){
  if (!Array.isArray(a) || a.length > $intern_28)
    throw new Error('Invalid retained elements');
  for (var i = 0; i < a.length; i++)
    if (!Array.isArray(a[i]) || a[i].length !== 3 || !Number.isInteger(a[i][0]) || !Number.isInteger(a[i][1]) || typeof a[i][2] !== 'boolean')
      throw new Error('Invalid retained entry');
  return a.length;
}

defineClass(133, 1, {}, EngineEntryPoint);
_.load_0 = function load(text_0, timeStep){
  $load(this, text_0, timeStep);
}
;
_.readCapture_0 = function readCapture(id_0){
  if (id_0 < 0 || id_0 >= this.app.elmList.arrayList.array.length)
    throw toJs(new IllegalArgumentException('Invalid recorder ID'));
  return capture(castTo($get_2(this.app.elmList, id_0), 4), this.app.sim.t, this.app.sim.timeStep_0);
}
;
_.reset_0 = function reset_12(){
  if (this.loadedText == null)
    throw toJs(new IllegalStateException('Load a circuit first'));
  $load(this, this.loadedText, this.loadedTimeStep);
}
;
_.setContact_0 = function setContact(id_0, position){
  $setContact(this, id_0, position);
}
;
_.setSwitch_0 = function setSwitch(id_0, closed_0){
  if (id_0 < 0 || id_0 >= this.app.elmList.arrayList.array.length || !instanceOf($get_2(this.app.elmList, id_0), 21))
    throw toJs(new IllegalArgumentException('Expected a switch element ID'));
  $setContact(this, id_0, closed_0?0:1);
}
;
_.setVariableVoltage_0 = function setVariableVoltage(id_0, voltage){
  var elm;
  if (id_0 < 0 || id_0 >= this.app.elmList.arrayList.array.length || !instanceOf($get_2(this.app.elmList, id_0), 32))
    throw toJs(new IllegalArgumentException('Expected variable source ID'));
  elm = castTo($get_2(this.app.elmList, id_0), 32);
  if (!(!isNaN(voltage) && !(!isNaN(voltage) && !isFinite(voltage))) || voltage < elm.bias || voltage > elm.maxVoltage)
    throw toJs(new IllegalArgumentException('Voltage outside source range'));
  $checkStopped(this);
  elm.frequency = voltage;
}
;
_.snapshot_0 = function snapshot(){
  var elm, i, result;
  result = $newSnapshot(this.app.sim.t, this.app.sim.timeStep_0, this.app.stopMessage, true);
  for (i = 0; i < this.app.elmList.arrayList.array.length; i++) {
    elm = castTo($get_2(this.app.elmList, i), 4);
    $appendElement(result, i, '' + charToString(elm.getDumpType() & 65535), elm.getCurrent(), elm.volts);
    $appendMeasurements(result, i, measurements(elm));
  }
  stopRequested(this.app.elmList) && (result['stopRequested'] = true , undefined);
  return result;
}
;
_.step_0 = function step_0(count){
  var elm, elm$iterator, i, trigger;
  if (this.loadedText == null)
    throw toJs(new IllegalStateException('Load a circuit first'));
  $checkStopped(this);
  trigger = false;
  for (elm$iterator = new ArrayList$1(this.app.elmList.arrayList); elm$iterator.i < elm$iterator.this$01.array.length;) {
    elm = castTo($next_0(elm$iterator), 4);
    instanceOf(elm, 31) && (trigger = true);
  }
  if (trigger) {
    for (i = 0; i < count; i++) {
      $stepCircuit(this.app.sim, 1);
      if (stopRequested(this.app.elmList))
        break;
    }
  }
   else {
    $stepCircuit(this.app.sim, count);
  }
  $checkStopped(this);
}
;
_.updateCircuit_0 = function updateCircuit(text_0, timeStep, retained){
  var count, elm, elm$iterator, fresh, i, i0, i1, n, next, o, old, previous, seenNew, seenOld;
  if (this.loadedText == null)
    throw toJs(new IllegalArgumentException('Load a circuit first'));
  next = $parse(text_0, timeStep);
  previous = this.app.elmList;
  count = retainedCount(retained);
  seenNew = initUnidimensionalArray(Z_classLit, $intern_12, 5, next.arrayList.array.length, 16, 1);
  seenOld = initUnidimensionalArray(Z_classLit, $intern_12, 5, previous.arrayList.array.length, 16, 1);
  for (i0 = 0; i0 < count; i0++) {
    n = retained[i0][0];
    o = retained[i0][1];
    if (n < 0 || n >= next.arrayList.array.length || o < 0 || o >= previous.arrayList.array.length || seenNew[n] || seenOld[o] || (checkArrayElementIndex(n, next.arrayList.array.length) , castTo($get_0(next.arrayList, n), 4)).___clazz != (checkArrayElementIndex(o, previous.arrayList.array.length) , castTo($get_0(previous.arrayList, o), 4)).___clazz)
      throw toJs(new IllegalArgumentException('Invalid retained element mapping'));
    seenNew[n] = true;
    seenOld[o] = true;
  }
  for (i1 = 0; i1 < count; i1++) {
    n = retained[i1][0];
    o = retained[i1][1];
    old = (checkArrayElementIndex(o, previous.arrayList.array.length) , castTo($get_0(previous.arrayList, o), 4));
    fresh = (checkArrayElementIndex(n, next.arrayList.array.length) , castTo($get_0(next.arrayList, n), 4));
    retained[i1][2] && configure(old, fresh);
    instanceOf(old, 56) && (castTo(old, 56).text_0 = castTo(fresh, 56).text_0);
    old.x_0 = fresh.x_0;
    old.y_0 = fresh.y_0;
    old.x2 = fresh.x2;
    old.y2 = fresh.y2;
    old.setPoints();
    checkArrayElementIndex(n, next.arrayList.array.length);
    $set(next.arrayList, n, old);
  }
  for (i = 0; i < next.arrayList.array.length; i++)
    seenNew[i] || initializeElement((checkArrayElementIndex(i, next.arrayList.array.length) , castTo($get_0(next.arrayList, i), 4)));
  this.app.elmList = next;
  this.app.sim.maxTimeStep = this.app.sim.minTimeStep = this.app.sim.timeStep_0 = timeStep;
  if (timeStep != this.loadedTimeStep)
    for (elm$iterator = new ArrayList$1(next.arrayList); elm$iterator.i < elm$iterator.this$01.array.length;) {
      elm = castTo($next_0(elm$iterator), 4);
      instanceOf(elm, 54) && elm.reset_0();
    }
  $analyzeCircuit(this.app.sim);
  $preStampAndStampCircuit(this.app.sim);
  this.loadedText = text_0;
  this.loadedTimeStep = timeStep;
  $checkStopped(this);
}
;
_.loadedTimeStep = 0;
var Lcom_lushprojects_circuitjs1_client_EngineEntryPoint_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'EngineEntryPoint', 133);
function array_0(obj, key, values){
  obj[key] = values?Array.prototype.slice.call(values):[];
}

function capture(elm, now_0, dt){
  var count, data_0, e, i, ptr, result, start_0, step, values;
  if (instanceOf(elm, 42)) {
    e = castTo(elm, 42);
    data_0 = e.data_0;
    ptr = e.dataFull?e.dataPtr:0;
    count = e.dataFull?e.dataCount:e.dataPtr;
    step = dt;
    start_0 = count == 0?now_0:now_0 - count * dt;
  }
   else if (instanceOf(elm, 28)) {
    e = castTo(elm, 28);
    data_0 = e.data_0;
    ptr = e.dataFull?e.dataPtr:0;
    count = e.dataFull?e.dataCount:e.dataPtr;
    step = e.sampleStep;
    start_0 = e.dataFull?e.nextDataSample - count * step:e.dataStart + step;
  }
   else 
    throw toJs(new IllegalArgumentException('Expected data/audio recorder'));
  values = initUnidimensionalArray(D_classLit, $intern_7, 5, count, 15, 1);
  for (i = 0; i < count; i++)
    values[i] = data_0[(ptr + i) % data_0.length];
  result = {};
  array_0(result, 'values', values);
  put(result, 'timeStep', step);
  put(result, 'startTime', start_0);
  return result;
}

function construct_0(f, dt){
  var allowed, args, count, det, duration, elm, flags, hi, i, label_0, lo, lookup, name_0, rate, st, threshold, type_0, v, x_0, x2, y_0, y2;
  type_0 = f[0];
  count = $equals_0(type_0, '172')?13:$equals_0(type_0, '181')?11:$equals_0(type_0, '207')?7:$equals_0(type_0, 'p')?9:$equals_0(type_0, '216') || $equals_0(type_0, '370') || $equals_0(type_0, '420') || $equals_0(type_0, '368') || $equals_0(type_0, '419') || $equals_0(type_0, '405') || $equals_0(type_0, 'instruction')?8:$equals_0(type_0, '210')?7:$equals_0(type_0, '211') || $equals_0(type_0, '408')?9:$equals_0(type_0, '415')?14:$equals_0(type_0, '427')?13:0;
  if (count == 0)
    return null;
  require(f.length == count, 'Invalid output/source field count');
  x_0 = __parseAndValidateInt(f[1], 10);
  y_0 = __parseAndValidateInt(f[2], 10);
  x2 = __parseAndValidateInt(f[3], 10);
  y2 = __parseAndValidateInt(f[4], 10);
  flags = __parseAndValidateInt(f[5], 10);
  allowed = $equals_0(type_0, 'p') || $equals_0(type_0, '370')?3:$equals_0(type_0, '207')?4:$equals_0(type_0, '368')?1:0;
  require(flags == allowed, 'Unsupported output/source flags');
  ($equals_0(type_0, '420') || $equals_0(type_0, '419') || $equals_0(type_0, '405') || $equals_0(type_0, '427') || $equals_0(type_0, 'instruction')) && require(y_0 == 32 && y2 == 32 && x2 - x_0 == 64, 'Invalid output chip geometry');
  args = '';
  for (i = 6; i < f.length; i++)
    args += f[i] + ' ';
  st = new StringTokenizer(args);
  if ($equals_0(type_0, '172')) {
    require($equals_0(f[6], '6') && $equals_0(f[10], '0') && $equals_0(f[11], '0.5'), 'Invalid variable source waveform');
    v = number_0(f, 7);
    hi = number_0(f, 8);
    lo = number_0(f, 9);
    require(lo < hi && !isNaN(hi - lo) && !(!isNaN(hi - lo) && !isFinite(hi - lo)) && v >= lo && v <= hi, 'Invalid variable source range/value');
    label_0 = decode(f[12]);
    require(label_0.length <= 80, 'Source label too long');
    elm = new VarRailElm(x_0, y_0, x2, y2, new StringTokenizer('6 ' + v + ' ' + hi + ' ' + lo + ' 0 0.5 Voltage'));
    elm.sliderText = label_0;
    return elm;
  }
  if ($equals_0(type_0, '181')) {
    require(number_0(f, 6) >= 300 && number_0(f, 6) <= 5000, 'Invalid initial lamp temperature');
    positive(f, stampJavaTypeInfo(getClassLiteralForArray(I_classLit, 1), $intern_12, 5, 15, [7, 8, 9, 10]));
    return new LampElm(x_0, y_0, x2, y2, st);
  }
  if ($equals_0(type_0, '207')) {
    name_0 = decode(f[6]);
    require(name_0.length > 0 && name_0.length <= 256, 'Invalid private net label');
    return new LabeledNodeElm(x_0, y_0, x2, y2, new StringTokenizer(escape_0(name_0)));
  }
  if ($equals_0(type_0, 'p')) {
    v = __parseAndValidateInt(f[6], 10);
    require(v >= 0 && v <= 5, 'Invalid output integer parameter');
    require($equals_0(f[7], '0') && number_0(f, 8) >= 0 && (number_0(f, 8) == 0 || finite_0(1 / number_0(f, 8))), 'Invalid voltmeter resistance/scale');
    return new ProbeElm(x_0, y_0, x2, y2, st);
  }
  if ($equals_0(type_0, '216')) {
    require(number_0(f, 6) >= 0 && number_0(f, 6) <= 1, 'Invalid test current');
    require(number_0(f, 7) >= 0, 'Invalid current compliance');
    elm = new OhmMeterElm(x_0, y_0, x2, y2, st);
    elm.currentValue = number_0(f, 6);
    return elm;
  }
  if ($equals_0(type_0, '370')) {
    v = __parseAndValidateInt(f[6], 10);
    require(v >= 0 && v <= 1, 'Invalid output integer parameter');
    require($equals_0(f[7], '0'), 'Invalid ammeter scale');
    return new AmmeterElm(x_0, y_0, x2, y2, st);
  }
  if ($equals_0(type_0, '420')) {
    require($equals_0(f[6], '32'), 'Invalid wattmeter width');
    v = __parseAndValidateInt(f[7], 10);
    require(v >= 0 && v <= 1, 'Invalid output integer parameter');
    return new WattmeterElm(x_0, y_0, x2, y2, st);
  }
  if ($equals_0(type_0, '368')) {
    v = __parseAndValidateInt(f[6], 10);
    require(v >= 0 && v <= 5, 'Invalid output integer parameter');
    label_0 = decode(f[7]);
    require(label_0.length <= 80, 'Test-point label too long');
    return new TestPointElm(x_0, y_0, x2, y2, new StringTokenizer(f[6] + ' ' + escape_0(label_0)));
  }
  if ($equals_0(type_0, '419')) {
    require($equals_0(f[6], '4'), 'Display requires four bits');
    v = __parseAndValidateInt(f[7], 10);
    require(v >= 0 && v <= 2, 'Invalid output integer parameter');
    return new DecimalDisplayElm(x_0, y_0, x2, y2, st);
  }
  if ($equals_0(type_0, '405')) {
    require($equals_0(f[6], '8') && $equals_0(f[7], '8'), 'LED array requires 8 by 8 pins');
    return new LEDArrayElm(x_0, y_0, x2, y2, st);
  }
  if ($equals_0(type_0, 'instruction')) {
    threshold = number_0(f, 6);
    lookup = decode(f[7]);
    require(lookup.length <= 4096, 'Lookup too long');
    return new EngineOutputSupport$EngineInstructionDisplay(x_0, y_0, x2, y2, threshold, lookup);
  }
  if ($equals_0(type_0, '210')) {
    v = __parseAndValidateInt(f[6], 10);
    require(v >= 1 && v <= $intern_28, 'Invalid output integer parameter');
    return new DataRecorderElm(x_0, y_0, x2, y2, st);
  }
  if ($equals_0(type_0, '211')) {
    duration = number_0(f, 6);
    rate = integer(f, 7, 8000, 48000);
    require((rate == 8000 || rate == 11025 || rate == 16000 || rate == 22050 || rate == 44100 || rate == 48000) && duration >= $intern_17 && duration <= 10 && $wnd.Math.floor(rate * duration) >= 1 && rate * duration <= $intern_29 && dt <= 1 / rate && $equals_0(f[8], '1'), 'Invalid audio capture duration/rate/timestep');
    return new AudioOutputElm(x_0, y_0, x2, y2, st);
  }
  if ($equals_0(type_0, '408')) {
    number_0(f, 6);
    integer(f, 7, 0, 1);
    require(number_0(f, 8) >= 0, 'Trigger delay must be nonnegative');
    return new StopTriggerElm(x_0, y_0, x2, y2, st);
  }
  if ($equals_0(type_0, '415')) {
    positive(f, stampJavaTypeInfo(getClassLiteralForArray(I_classLit, 1), $intern_12, 5, 15, [6, 7, 10, 11, 12]));
    require(number_0(f, 8) >= 0 && number_0(f, 9) >= 0, 'Invalid motor constant');
    number_0(f, 13);
    return new DCMotorElm(x_0, y_0, x2, y2, st);
  }
  positive(f, stampJavaTypeInfo(getClassLiteralForArray(I_classLit, 1), $intern_12, 5, 15, [6, 7, 8, 9, 10, 12]));
  require(number_0(f, 11) >= 0, 'Invalid motor friction');
  det = number_0(f, 8) * number_0(f, 9) - number_0(f, 10) * number_0(f, 10);
  require(!isNaN(det) && !(!isNaN(det) && !isFinite(det)) && det > 0 && !isNaN(1 / det) && !(!isNaN(1 / det) && !isFinite(1 / det)), 'Invalid motor inductance matrix');
  return new ThreePhaseMotorElm(x_0, y_0, x2, y2, st);
}

function decode(value_0){
  return value_0 === '%00'?'':decodeURIComponent(value_0);
}

function finite_0(v){
  return !isNaN(v) && !(!isNaN(v) && !isFinite(v));
}

function initialize(elm){
  var e;
  if (instanceOf(elm, 28)) {
    e = castTo(elm, 28);
    e.dataStart = sim.t;
    e.nextDataSample = e.dataStart + e.sampleStep;
    e.dataSampleCount = 0;
    e.dataSample = 0;
  }
}

function integer(f, i, min_0, max_0){
  var v;
  v = __parseAndValidateInt(f[i], 10);
  require(v >= min_0 && v <= max_0, 'Invalid output integer parameter');
  return v;
}

function measurements(elm){
  var e, i, result, v;
  result = {};
  if (instanceOf(elm, 32))
    put(result, 'voltage', castTo(elm, 32).frequency);
  else if (instanceOf(elm, 59)) {
    e = castTo(elm, 59);
    put(result, 'temperature', e.temp);
    put(result, 'resistance', e.resistance);
    put(result, 'power', (e.volts[0] - e.volts[1]) * e.current_1);
  }
   else if (instanceOf(elm, 60)) {
    e = castTo(elm, 60);
    put(result, 'value', meter(e.meter, e.volts[0] - e.volts[1], e.rmsV, e.lastMaxV, e.lastMinV, e.binaryLevel));
  }
   else if (instanceOf(elm, 61)) {
    e = castTo(elm, 61);
    put(result, 'value', meter(e.meter, e.volts[0], e.rmsV, e.lastMaxV, e.lastMinV, e.binaryLevel));
  }
   else if (instanceOf(elm, 111)) {
    put(result, 'value', elm.getCurrent() == 0?NaN:elm.getVoltageDiff() / elm.getCurrent());
  }
   else if (instanceOf(elm, 62)) {
    e = castTo(elm, 62);
    put(result, 'value', e.meter == 0?e.current_1:e.rmsI);
  }
   else if (instanceOf(elm, 63)) {
    e = castTo(elm, 63);
    put(result, 'value', e.meter == 0?(e.volts[2] - e.volts[0]) * e.currents[1]:e.avgPower);
    put(result, 'voltage', e.volts[2] - e.volts[0]);
    put(result, 'current', e.currents[1]);
  }
   else if (instanceOf(elm, 64)) {
    e = castTo(elm, 64);
    v = 0;
    for (i = 0; i < 4; i++)
      e.pins[i].value_0 && (v |= 1 << i);
    put(result, 'value', v);
    result['text'] = toString_9(v, e.displayMode == 1?16:e.displayMode == 2?8:10).toUpperCase();
  }
   else if (instanceOf(elm, 37)) {
    result['text'] = $getDisplayText(castTo(elm, 37));
  }
   else if (instanceOf(elm, 102))
    array_0(result, 'currents', castTo(elm, 102).currents);
  else if (instanceOf(elm, 42)) {
    e = castTo(elm, 42);
    put(result, 'samples', e.dataFull?e.dataCount:e.dataPtr);
  }
   else if (instanceOf(elm, 28)) {
    e = castTo(elm, 28);
    put(result, 'samples', e.dataFull?e.dataCount:e.dataPtr);
  }
   else if (instanceOf(elm, 31)) {
    result['stopped'] = castTo(elm, 31).stopped;
  }
   else if (instanceOf(elm, 43)) {
    e = castTo(elm, 43);
    put(result, 'speed', e.speed);
    put(result, 'angle', e.angle);
    put(result, 'current', e.coilCurrent);
  }
   else if (instanceOf(elm, 65)) {
    e = castTo(elm, 65);
    put(result, 'speed', e.speed);
    put(result, 'angle', e.angle);
  }
   else if (instanceOf(elm, 68))
    put(result, 'frequency', castTo(elm, 68).frequency);
  else if (instanceOf(elm, 69)) {
    result['conducting'] = castTo(elm, 69).state;
  }
   else if (instanceOf(elm, 70)) {
    result['blown'] = castTo(elm, 70).blown;
  }
   else if (instanceOf(elm, 71))
    put(result, 'resistance', castTo(elm, 71).resistance);
  else if (instanceOf(elm, 66)) {
    e = castTo(elm, 66);
    put(result, 'lux', e.lux);
    put(result, 'resistance', e.resistance);
  }
   else if (instanceOf(elm, 67)) {
    e = castTo(elm, 67);
    put(result, 'temperature', e.temperature);
    put(result, 'resistance', e.resistance);
  }
   else 
    instanceOf(elm, 72)?put(result, 'anodeCurrent', castTo(elm, 72).ia):instanceOf(elm, 73)?(result['conducting'] = castTo(elm, 73).state , undefined):instanceOf(elm, 75)?(result['conducting'] = castTo(elm, 75).state , undefined):instanceOf(elm, 76) && put(result, 'capacitance', castTo(elm, 76).capacitance);
  return result;
}

function meter(mode, v, rms, max_0, min_0, binary){
  return mode == 0?v:mode == 1?rms:mode == 2?max_0:mode == 3?min_0:mode == 4?max_0 - min_0:binary;
}

function number_0(f, i){
  var v;
  v = __parseAndValidateDouble(f[i]);
  require(!isNaN(v) && !(!isNaN(v) && !isFinite(v)), 'Non-finite output parameter');
  return v;
}

function positive(f, indices){
  var i, i$index, i$max;
  for (i$index = 0 , i$max = indices.length; i$index < i$max; ++i$index) {
    i = indices[i$index];
    require(number_0(f, i) > 0 && finite_0(1 / number_0(f, i)), 'Output parameter must be positive and finite');
  }
}

function put(obj, key, value_0){
  obj[key] = isFinite(value_0)?value_0:null;
}

function require(ok, message){
  if (!ok)
    throw toJs(new IllegalArgumentException(message));
}

function stopRequested(elements){
  var elm, elm$iterator;
  for (elm$iterator = new ArrayList$1(elements.arrayList); elm$iterator.i < elm$iterator.this$01.array.length;) {
    elm = castTo($next_0(elm$iterator), 4);
    if (instanceOf(elm, 31) && castTo(elm, 31).stopped)
      return true;
  }
  return false;
}

function $getDisplayText(this$static){
  var entry, i, value_0;
  value_0 = $readInputValue(this$static);
  for (i = 0; i != this$static.entries_0.arrayList.array.length; i++) {
    entry = castTo($get_2(this$static.entries_0, i), 100);
    if (value_0 >= entry.lo && value_0 <= entry.hi)
      return $getText(entry, value_0);
  }
  return '' + value_0;
}

function $parseEntries(this$static){
  var dash, eq, hi, i, k, key, line, lines, lo, val, start_0;
  this$static.entries_0 = new Vector;
  if (this$static.lookupText == null || this$static.lookupText.length == 0)
    return;
  lines = $split(this$static.lookupText, '\n', 0);
  for (i = 0; i != lines.length; i++) {
    line = $trim(lines[i]);
    if (line.length == 0)
      continue;
    eq = $indexOf_0(line, fromCodePoint(61));
    if (eq < 0) {
      continue;
    }
    key = $trim(line.substr(0, eq));
    val = line.substr(eq + 1);
    try {
      dash = (start_0 = 0 , $equals_0(key.substr(0, 2), '0x') || $equals_0(key.substr(0, 2), '0X')?(start_0 = 2):($equals_0(key.substr(0, 2), '0b') || $equals_0(key.substr(0, 2), '0B')) && (start_0 = 2) , $indexOf_1(key, fromCodePoint(45), start_0));
      if (dash >= 0) {
        lo = $parseNumber(key.substr(0, dash));
        hi = $parseNumber(key.substr(dash + 1));
        $add_2(this$static.entries_0, new InstructionDisplayElm$LookupEntry(lo, hi, val));
      }
       else {
        k = $parseNumber(key);
        $add_2(this$static.entries_0, new InstructionDisplayElm$LookupEntry(k, k, val));
      }
    }
     catch ($e0) {
      $e0 = toJava($e0);
      if (!instanceOf($e0, 9))
        throw toJs($e0);
    }
  }
}

function $parseNumber(s){
  s = $trim(s);
  if ($equals_0(s.substr(0, 2), '0x') || $equals_0(s.substr(0, 2), '0X'))
    return __parseAndValidateInt(s.substr(2), 16);
  if ($equals_0(s.substr(0, 2), '0b') || $equals_0(s.substr(0, 2), '0B'))
    return __parseAndValidateInt(s.substr(2), 2);
  return __parseAndValidateInt(s, 10);
}

function $readInputValue(this$static){
  var i, value_0;
  value_0 = 0;
  for (i = 0; i != this$static.busWidth; i++)
    this$static.volts[i] > this$static.threshold && (value_0 |= 1 << i);
  return value_0;
}

defineClass(37, 4, $intern_30);
_.getConnection = function getConnection_7(n1, n2){
  return false;
}
;
_.getPost = function getPost_6(n){
  return new Point_1(this.x_0, this.y_0, n);
}
;
_.getPostCount = function getPostCount_13(){
  return this.busWidth;
}
;
_.getPostWidth = function getPostWidth_1(n){
  return this.busWidth;
}
;
_.getVoltageDiff = function getVoltageDiff_7(){
  return this.volts[0];
}
;
_.getVoltageSourceCount = function getVoltageSourceCount_9(){
  return 0;
}
;
_.setPoints = function setPoints_19(){
  $setPoints(this);
  this.lead1 = new Point;
}
;
_.busWidth = 0;
_.threshold = 0;
var Lcom_lushprojects_circuitjs1_client_InstructionDisplayElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'InstructionDisplayElm', 37);
function EngineOutputSupport$EngineInstructionDisplay(x_0, y_0, x2, y2, threshold, lookup){
  this.x_0 = this.x2 = x_0;
  this.y_0 = this.y2 = y_0;
  this.flags = 0;
  $allocNodes(this);
  this.initBoundingBox();
  this.busWidth = 4;
  this.threshold = 2.5;
  this.entries_0 = new Vector;
  this.lookupText = '0=text0\n1=text1\n0x2-0xF=other ({a})\n';
  $parseEntries(this);
  this.x2 = x2;
  this.y2 = y2;
  this.threshold = threshold;
  this.lookupText = lookup;
  this.busWidth = 4;
  $parseEntries(this);
  $allocNodes(this);
}

defineClass(161, 37, $intern_30, EngineOutputSupport$EngineInstructionDisplay);
_.getPost = function getPost_7(n){
  return new Point_0(this.x_0, this.y_0 + 32 * (3 - n));
}
;
_.getPostWidth = function getPostWidth_2(n){
  return 1;
}
;
var Lcom_lushprojects_circuitjs1_client_EngineOutputSupport$EngineInstructionDisplay_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'EngineOutputSupport/EngineInstructionDisplay', 161);
function configure_0(old, fresh){
  var a, b;
  if (instanceOf(old, 69)) {
    a = castTo(old, 69);
    b = castTo(fresh, 69);
    a.onresistance = b.onresistance;
    a.offresistance = b.offresistance;
    a.breakdown = b.breakdown;
    a.holdcurrent = b.holdcurrent;
  }
   else if (instanceOf(old, 71)) {
    a = castTo(old, 71);
    b = castTo(fresh, 71);
    a.r_on = b.r_on;
    a.r_off = b.r_off;
    a.totalWidth = b.totalWidth;
    a.mobility = b.mobility;
    a.dopeWidth = $wnd.Math.min(a.dopeWidth, a.totalWidth);
  }
   else if (instanceOf(old, 70)) {
    a = castTo(old, 70);
    b = castTo(fresh, 70);
    a.resistance = b.resistance;
    a.i2t = b.i2t;
  }
   else if (instanceOf(old, 66)) {
    castTo(old, 66).position = castTo(fresh, 66).position;
  }
   else if (instanceOf(old, 67)) {
    a = castTo(old, 67);
    b = castTo(fresh, 67);
    a.r25 = b.r25;
    a.r50 = b.r50;
    a.minTempr = b.minTempr;
    a.maxTempr = b.maxTempr;
    a.position = b.position;
    a.b25100 = b.b25100;
    a.rneg40 = b.rneg40;
  }
}

function construct_1(fields, x_0, y_0, x2, y2, flags, dt){
  var args, count, elm, i, initial, max_0, min_0, mobility, off, on, position, r25, r50, tokens, type_0, width_0;
  type_0 = fields[0];
  switch (type_0) {
    case '175':
      count = 6;
      break;
    case '374':
      count = 8;
      break;
    case '187':
    case '404':
      count = 10;
      break;
    case '350':
    case 'm':
      count = 12;
      break;
    default:return null;
  }
  require_0(fields.length == count && flags == 0, 'Invalid passive model format');
  require_0(x_0 == x2 && y_0 == 32 && y2 == 64, 'Invalid passive model geometry');
  args = '';
  for (i = 6; i < fields.length; i++)
    args += fields[i] + ' ';
  tokens = new StringTokenizer(args);
  switch (type_0) {
    case '175':
      return new TunnelDiodeElm(x_0, y_0, x2, y2, flags);
    case '187':
      {
        on = positive_0(fields, 6);
        off = positive_0(fields, 7);
        positive_0(fields, 8);
        require_0(off >= on && number_1(fields, 9) >= 0, 'Invalid spark gap resistance or holding current');
        return new SparkGapElm(x_0, y_0, x2, y2, flags, tokens);
      }

    case 'm':
      {
        on = positive_0(fields, 6);
        off = positive_0(fields, 7);
        width_0 = positive_0(fields, 9);
        initial = number_1(fields, 8);
        mobility = number_1(fields, 10);
        require_0(off >= on && initial >= 0 && initial <= width_0 && mobility >= 0 && !isNaN(dt * mobility * on / width_0) && !(!isNaN(dt * mobility * on / width_0) && !isFinite(dt * mobility * on / width_0)) && $equals_0(fields[11], '0'), 'Invalid memristor resistance, width, or mobility');
        return new MemristorElm(x_0, y_0, x2, y2, flags, tokens);
      }

    case '404':
      positive_0(fields, 6);
      positive_0(fields, 7);
      require_0($equals_0(fields[8], '0') && $equals_0(fields[9], 'false'), 'Invalid initial fuse state');
      return new FuseElm(x_0, y_0, x2, y2, flags, tokens);
    case '374':
      {
        position = number_1(fields, 6);
        require_0(position >= 0 && position <= 1 && $equals_0(fields[7], 'Light'), 'Invalid light sensor position');
        return new LDRElm(x_0, y_0, x2, y2, flags, tokens);
      }

    default:{
        r25 = positive_0(fields, 6);
        r50 = positive_0(fields, 7);
        min_0 = number_1(fields, 8);
        max_0 = number_1(fields, 9);
        position = number_1(fields, 10);
        require_0(r25 > r50 && min_0 > -273.15 && max_0 > min_0 && !isNaN(max_0 - min_0) && !(!isNaN(max_0 - min_0) && !isFinite(max_0 - min_0)) && position >= 0 && position <= 1 && $equals_0(fields[11], 'Temperature'), 'Invalid thermistor resistance or temperature range');
        elm = new ThermistorNTCElm(x_0, y_0, x2, y2, flags, tokens);
        require_0($calcResistance_0(elm, toDouble_0(fromDouble_0($wnd.Math.round(max_0)))) > 0 && elm.resistance > 0, 'Thermistor resistance must remain positive across its temperature range');
        return elm;
      }

  }
}

function number_1(fields, index_0){
  var value_0;
  value_0 = __parseAndValidateDouble(fields[index_0]);
  require_0(!isNaN(value_0) && !(!isNaN(value_0) && !isFinite(value_0)), 'Non-finite passive parameter');
  return value_0;
}

function positive_0(fields, index_0){
  var value_0;
  value_0 = number_1(fields, index_0);
  require_0(value_0 > 0 && !isNaN(1 / value_0) && !(!isNaN(1 / value_0) && !isFinite(1 / value_0)), 'Expected positive passive parameter');
  return value_0;
}

function require_0(ok, message){
  if (!ok)
    throw toJs(new IllegalArgumentException(message));
}

function configure_1(old, fresh){
  var a, b;
  if (instanceOf(old, 72)) {
    a = castTo(old, 72);
    b = castTo(fresh, 72);
    a.triggerI = b.triggerI;
    a.holdingI = b.holdingI;
    a.gresistance = b.gresistance;
  }
   else if (instanceOf(old, 73)) {
    a = castTo(old, 73);
    b = castTo(fresh, 73);
    a.onresistance = b.onresistance;
    a.offresistance = b.offresistance;
    a.breakdown = b.breakdown;
    a.holdcurrent = b.holdcurrent;
  }
   else if (instanceOf(old, 75)) {
    a = castTo(old, 75);
    b = castTo(fresh, 75);
    a.triggerI = b.triggerI;
    a.holdingI = b.holdingI;
    a.cresistance = b.cresistance;
  }
   else if (instanceOf(old, 76)) {
    castTo(old, 76).baseCapacitance = castTo(fresh, 76).baseCapacitance;
  }
   else if (instanceOf(old, 96)) {
    a = castTo(old, 96);
    b = castTo(fresh, 96);
    a.mu = b.mu;
    a.kg1 = b.kg1;
  }
}

function construct_2(fields, x_0, y_0, x2, y2, flags, dt){
  var args, diac, i, scr, three, tokens, triac, triode, type_0, varactor;
  type_0 = fields[0];
  scr = $equals_0(type_0, '177');
  diac = $equals_0(type_0, '203');
  triac = $equals_0(type_0, '206');
  varactor = $equals_0(type_0, '176');
  triode = $equals_0(type_0, '173');
  if (!(scr || diac || triac || varactor || triode))
    return null;
  require(fields.length == (scr?11:diac || triac?10:8) && flags == (scr?1:triode?2:0), 'Invalid semiconductor model format');
  three = scr || triac || triode;
  require(y_0 == 32 && (three?x2 - x_0 == 64 && y2 == 32:x_0 == x2 && y2 == 64), 'Invalid semiconductor model geometry');
  args = '';
  for (i = 6; i < fields.length; i++)
    args += fields[i] + ' ';
  tokens = new StringTokenizer(args);
  if (scr) {
    require($equals_0(fields[6], '0') && $equals_0(fields[7], '0'), 'Invalid initial SCR state');
    positive(fields, stampJavaTypeInfo(getClassLiteralForArray(I_classLit, 1), $intern_12, 5, 15, [8, 9, 10]));
    return new SCRElm(x_0, y_0, x2, y2, flags, tokens);
  }
  if (diac) {
    positive(fields, stampJavaTypeInfo(getClassLiteralForArray(I_classLit, 1), $intern_12, 5, 15, [6, 7, 8]));
    require(number_0(fields, 7) >= number_0(fields, 6) && number_0(fields, 9) >= 0, 'Invalid DIAC resistance or holding current');
    return new DiacElm(x_0, y_0, x2, y2, flags, tokens);
  }
  if (triac) {
    positive(fields, stampJavaTypeInfo(getClassLiteralForArray(I_classLit, 1), $intern_12, 5, 15, [6, 7, 8]));
    require($equals_0(fields[9], 'false'), 'Invalid initial TRIAC state');
    return new TriacElm(x_0, y_0, x2, y2, flags, tokens);
  }
  if (varactor) {
    require($equals_0(fields[6], '0'), 'Invalid initial varactor bias');
    positive(fields, stampJavaTypeInfo(getClassLiteralForArray(I_classLit, 1), $intern_12, 5, 15, [7]));
    require(finite_0(dt / number_0(fields, 7)), 'Invalid varactor companion resistance');
    return new VaractorElm(x_0, y_0, x2, y2, flags, tokens);
  }
  positive(fields, stampJavaTypeInfo(getClassLiteralForArray(I_classLit, 1), $intern_12, 5, 15, [6, 7]));
  return new TriodeElm(x_0, y_0, x2, y2, flags, tokens);
}

function configure_2(old, fresh){
  var a, b;
  if (instanceOf(old, 68)) {
    a = castTo(old, 68);
    b = castTo(fresh, 68);
    a.minF = b.minF;
    a.maxF = b.maxF;
    a.maxV = b.maxV;
    a.sweepTime = b.sweepTime;
    a.savedTimeStep = NaN;
  }
   else if (instanceOf(old, 95)) {
    a = castTo(old, 95);
    b = castTo(fresh, 95);
    a.carrierfreq = b.carrierfreq;
    a.signalfreq = b.signalfreq;
    a.maxVoltage = b.maxVoltage;
  }
   else if (instanceOf(old, 41)) {
    a = castTo(old, 41);
    b = castTo(fresh, 41);
    a.carrierfreq = b.carrierfreq;
    a.signalfreq = b.signalfreq;
    a.maxVoltage = b.maxVoltage;
    a.deviation = b.deviation;
  }
   else if (instanceOf(old, 77)) {
    a = castTo(old, 77);
    b = castTo(fresh, 77);
    a.slewRate = b.slewRate;
    a.lowerTrigger = b.lowerTrigger;
    a.upperTrigger = b.upperTrigger;
    a.logicOnLevel = b.logicOnLevel;
    a.logicOffLevel = b.logicOffLevel;
  }
}

function construct_3(fields, x_0, y_0, x2, y2, flags, dt){
  var am, amplitude, antenna, first, fm, fourth, high, low, lower, multiplier, noise, offset, parameters, peak, ratio, schmitt, second, slew, sweep, tokens, tokens0, type_0, upper;
  type_0 = fields[0];
  sweep = $equals_0(type_0, '170');
  am = $equals_0(type_0, '200');
  fm = $equals_0(type_0, '201');
  antenna = $equals_0(type_0, 'A');
  noise = $equals_0(type_0, 'R') && fields.length > 6 && $equals_0(fields[6], '6');
  schmitt = $equals_0(type_0, '182') || $equals_0(type_0, '183');
  if (!(sweep || am || fm || antenna || noise || schmitt))
    return null;
  require_1(x_0 == x2 && y_0 == 32 && y2 == 64, 'Invalid signal model geometry');
  require_1(sweep?flags >= 0 && flags <= 3:flags == 0, 'Invalid signal model flags');
  if (antenna) {
    require_1(fields.length == 6, 'Antenna has no configurable parameters');
    return new AntennaElm(x_0, y_0, x2, y2, flags, new StringTokenizer('1 40 5 0 0 0.5'));
  }
  if (noise) {
    require_1(fields.length == 12 && $equals_0(fields[7], '40') && $equals_0(fields[10], '0') && $equals_0(fields[11], '0.5'), 'Invalid noise waveform format');
    amplitude = number_2(fields, 8);
    offset = number_2(fields, 9);
    require_1(amplitude >= 0 && !isNaN(offset + amplitude) && !(!isNaN(offset + amplitude) && !isFinite(offset + amplitude)) && !isNaN(offset - amplitude) && !(!isNaN(offset - amplitude) && !isFinite(offset - amplitude)), 'Invalid noise amplitude or offset');
    return new NoiseElm(x_0, y_0, x2, y2, flags, new StringTokenizer('6 40 ' + fields[8] + ' ' + fields[9] + ' 0 0.5'));
  }
  if (schmitt) {
    require_1(fields.length == 11, 'Expected five Schmitt trigger parameters');
    slew = number_2(fields, 6);
    lower = number_2(fields, 7);
    upper = number_2(fields, 8);
    high = number_2(fields, 9);
    low = number_2(fields, 10);
    require_1(slew > 0 && lower < upper && low < high && !isNaN(high - low) && !(!isNaN(high - low) && !isFinite(high - low)), 'Schmitt trigger requires positive slew rate and ordered thresholds and output levels');
    tokens0 = new StringTokenizer(fields[6] + ' ' + fields[7] + ' ' + fields[8] + ' ' + fields[9] + ' ' + fields[10]);
    return $equals_0(type_0, '182')?new SchmittElm(x_0, y_0, x2, y2, flags, tokens0):new InvertingSchmittElm(x_0, y_0, x2, y2, flags, tokens0);
  }
  require_1(fields.length == (am?9:10), 'Invalid signal generator field count');
  first = number_2(fields, 6);
  second = number_2(fields, 7);
  peak = number_2(fields, 8);
  require_1(first >= 0 && !isNaN($intern_10 * first) && !(!isNaN($intern_10 * first) && !isFinite($intern_10 * first)), 'Invalid signal frequency');
  require_1(second >= 0 && !isNaN($intern_10 * second) && !(!isNaN($intern_10 * second) && !isFinite($intern_10 * second)), 'Invalid signal frequency');
  require_1(peak >= 0, 'Expected nonnegative peak voltage');
  parameters = fields[6] + ' ' + fields[7] + ' ' + fields[8];
  if (am)
    return new AMElm(x_0, y_0, x2, y2, flags, new StringTokenizer(parameters));
  fourth = number_2(fields, 9);
  tokens = new StringTokenizer(parameters + ' ' + fields[9]);
  if (fm) {
    require_1(fourth >= 0, 'Expected nonnegative frequency deviation');
    require_1(first + fourth >= 0 && !isNaN($intern_10 * (first + fourth)) && !(!isNaN($intern_10 * (first + fourth)) && !isFinite($intern_10 * (first + fourth))), 'Invalid signal frequency');
    return new FMElm(x_0, y_0, x2, y2, flags, tokens);
  }
  require_1(first > 0 && second >= first && fourth >= dt, 'Invalid sweep range or duration');
  if ((flags & 1) != 0) {
    ratio = second / first;
    multiplier = $wnd.Math.pow(ratio, dt / fourth);
    require_1(!isNaN(ratio) && !(!isNaN(ratio) && !isFinite(ratio)) && !isNaN(multiplier * second) && !(!isNaN(multiplier * second) && !isFinite(multiplier * second)), 'Invalid logarithmic sweep rate');
  }
   else {
    require_1(!isNaN(dt * (second - first) / fourth + second) && !(!isNaN(dt * (second - first) / fourth + second) && !isFinite(dt * (second - first) / fourth + second)), 'Invalid linear sweep rate');
  }
  return new SweepElm(x_0, y_0, x2, y2, flags, tokens);
}

function number_2(fields, index_0){
  var value_0;
  value_0 = __parseAndValidateDouble(fields[index_0]);
  require_1(!isNaN(value_0) && !(!isNaN(value_0) && !isFinite(value_0)), 'Non-finite signal parameter');
  return value_0;
}

function require_1(ok, message){
  if (!ok)
    throw toJs(new IllegalArgumentException(message));
}

function construct_4(f, x_0, y_0, x2, y2, flags){
  var args, count, dpdt, elm, group, label_0, mbb, pos, resistance, spdt, spst, tokens, type_0;
  type_0 = f[0];
  spst = $equals_0(type_0, 's');
  spdt = $equals_0(type_0, 'S');
  dpdt = $equals_0(type_0, '429');
  mbb = $equals_0(type_0, '416');
  if (!(spst || spdt || dpdt || mbb))
    return null;
  if (f.length == (spst?8:spdt?10:9))
    return null;
  require(f.length == (spst?10:spdt?12:11) && flags >= 0 && flags <= 3, 'Invalid switch format');
  require($equals_0(f[7], 'true') || $equals_0(f[7], 'false'), 'Invalid momentary state');
  resistance = number_0(f, 8);
  require(resistance >= 0 && (resistance == 0 || !isNaN(1 / resistance) && !(!isNaN(1 / resistance) && !isFinite(1 / resistance))), 'Invalid switch resistance');
  label_0 = decode(f[9]);
  require(label_0.length <= 80, 'Switch label too long');
  pos = integer(f, 6, 0, mbb?3:spdt?9:1);
  count = 2;
  group = 0;
  if (spdt) {
    group = integer(f, 10, 0, 1000);
    count = integer(f, 11, 2, 10);
    require(pos < ((flags & 1) != 0 && count == 2?3:count) && !(count > 2 && $equals_0(f[7], 'true')), 'Invalid switch throws or position');
  }
  dpdt && (count = integer(f, 10, 1, 8));
  mbb && (group = integer(f, 10, 0, 1000));
  args = f[6] + ' ' + f[7] + (label_0.length == 0?'':' ' + escape_0(label_0));
  label_0.length > 0 && (flags |= 4);
  spdt && (args += ' ' + group + ' ' + count);
  dpdt && (args += ' ' + count);
  mbb && (args += ' ' + group);
  tokens = new StringTokenizer(args);
  elm = spst?new SwitchElm(x_0, y_0, x2, y2, flags, tokens):spdt?new Switch2Elm(x_0, y_0, x2, y2, flags, tokens):dpdt?new DPDTSwitchElm(x_0, y_0, x2, y2, flags, tokens):new MBBSwitchElm(x_0, y_0, x2, y2, flags, tokens);
  elm.resistance = resistance;
  $allocNodes(elm);
  return elm;
}

function construct_5(f, x_0, y_0, x2, y2, flags){
  var i, i0, m, name_0, v, v0, v1, v2, value_0, values;
  if (!$equals_0(f[0], 't') || f.length == 10)
    return null;
  require(f.length == 11 || f.length == 31, 'Invalid transistor model format');
  require(flags >= 0 && flags <= 3 && x2 - x_0 == 64 && y_0 == 32 && y2 == 32 && ($equals_0(f[6], '1') || $equals_0(f[6], '-1')) && $equals_0(f[7], '0') && $equals_0(f[8], '0'), 'Invalid transistor format');
  positive(f, stampJavaTypeInfo(getClassLiteralForArray(I_classLit, 1), $intern_12, 5, 15, [9]));
  createModelMap_0();
  name_0 = f[10];
  if ($equals_0(name_0, 'custom')) {
    require(f.length == 31, 'Invalid custom transistor field count');
    for (i0 = 11; i0 < 31; i0++) {
      value_0 = number_0(f, i0);
      require(value_0 >= 0 && (value_0 == 0 || !isNaN(1 / value_0) && !(!isNaN(1 / value_0) && !isFinite(1 / value_0))), 'Invalid transistor model value');
    }
    positive(f, stampJavaTypeInfo(getClassLiteralForArray(I_classLit, 1), $intern_12, 5, 15, [11, 12, 17, 18, 20, 22, 24, 25, 27, 28]));
    values = '';
    for (i = 11; i < 31; i++)
      values += ':' + f[i];
    name_0 = '~react-bjt' + values;
    m = new TransistorModel_1(number_0(f, 11));
    m.name_0 = name_0;
    m.betaR = number_0(f, 12);
    m.invEarlyVoltF = (v0 = number_0(f, 13) , v0 == 0?0:1 / v0);
    m.invEarlyVoltR = (v1 = number_0(f, 14) , v1 == 0?0:1 / v1);
    m.invRollOffF = (v2 = number_0(f, 15) , v2 == 0?0:1 / v2);
    m.invRollOffR = (v = number_0(f, 16) , v == 0?0:1 / v);
    m.emissionCoeffF = number_0(f, 17);
    m.emissionCoeffR = number_0(f, 18);
    m.BEleakCur = number_0(f, 19);
    m.leakBEemissionCoeff = number_0(f, 20);
    m.BCleakCur = number_0(f, 21);
    m.leakBCemissionCoeff = number_0(f, 22);
    m.junctionCapBE = number_0(f, 23);
    m.junctionPotBE = number_0(f, 24);
    m.junctionExpBE = number_0(f, 25);
    m.junctionCapBC = number_0(f, 26);
    m.junctionPotBC = number_0(f, 27);
    m.junctionExpBC = number_0(f, 28);
    m.transitTimeF = number_0(f, 29);
    m.transitTimeR = number_0(f, 30);
    $putStringValue(modelMap_0, name_0, m);
  }
   else 
    require(f.length == 11 && ($equals_0(name_0, 'default') || $equals_0(name_0, 'spice-default')), 'Unknown transistor model');
  return new TransistorElm(x_0, y_0, x2, y2, flags, new StringTokenizer(f[6] + ' 0 0 ' + f[9] + ' ' + name_0));
}

function $eval(this$static, es){
  var i, left, right, x_0;
  left = null;
  right = null;
  if (!!this$static.children && this$static.children.arrayList.array.length > 0) {
    left = castTo($firstElement(this$static.children), 13);
    this$static.children.arrayList.array.length == 2 && (right = castTo($lastElement(this$static.children), 13));
  }
  switch (this$static.type_0) {
    case 1:
      return $eval(left, es) + $eval(right, es);
    case 2:
      return $eval(left, es) - $eval(right, es);
    case 7:
      return $eval(left, es) * $eval(right, es);
    case 8:
      return $eval(left, es) / $eval(right, es);
    case 9:
      return $wnd.Math.pow($eval(left, es), $eval(right, es));
    case 33:
      return $eval(left, es) != 0 || $eval(right, es) != 0?1:0;
    case 34:
      return $eval(left, es) != 0 && $eval(right, es) != 0?1:0;
    case 35:
      return $eval(left, es) == $eval(right, es)?1:0;
    case 40:
      return $eval(left, es) != $eval(right, es)?1:0;
    case 36:
      return $eval(left, es) <= $eval(right, es)?1:0;
    case 37:
      return $eval(left, es) >= $eval(right, es)?1:0;
    case 38:
      return $eval(left, es) < $eval(right, es)?1:0;
    case 39:
      return $eval(left, es) > $eval(right, es)?1:0;
    case 32:
      return $eval(castTo($get_2(this$static.children, $eval(left, es) != 0?1:2), 13), es);
    case 10:
      return -$eval(left, es);
    case 41:
      return $eval(left, es) == 0?1:0;
    case 6:
      return this$static.value_0;
    case 3:
      return es.t;
    case 11:
      return $wnd.Math.sin($eval(left, es));
    case 12:
      return $wnd.Math.cos($eval(left, es));
    case 13:
      return $wnd.Math.abs($eval(left, es));
    case 14:
      return $wnd.Math.exp($eval(left, es));
    case 15:
      return $wnd.Math.log($eval(left, es));
    case 16:
      return $wnd.Math.sqrt($eval(left, es));
    case 17:
      return $wnd.Math.tan($eval(left, es));
    case 44:
      return $wnd.Math.asin($eval(left, es));
    case 45:
      return $wnd.Math.acos($eval(left, es));
    case 46:
      return $wnd.Math.atan($eval(left, es));
    case 47:
      return sinh($eval(left, es));
    case 48:
      return cosh($eval(left, es));
    case 49:
      return tanh($eval(left, es));
    case 50:
      return round_int($eval(left, es)) & round_int($eval(right, es));
    case 51:
      return round_int($eval(left, es)) | round_int($eval(right, es));
    case 52:
      return round_int($eval(left, es)) >> round_int($eval(right, es));
    case 42:
      return $wnd.Math.floor($eval(left, es));
    case 43:
      return $wnd.Math.ceil($eval(left, es));
    case 20:
      {
        x_0 = $eval(left, es);
        for (i = 1; i < this$static.children.arrayList.array.length; i++)
          x_0 = $wnd.Math.min(x_0, $eval(castTo($get_2(this$static.children, i), 13), es));
        return x_0;
      }

    case 19:
      {
        x_0 = $eval(left, es);
        for (i = 1; i < this$static.children.arrayList.array.length; i++)
          x_0 = $wnd.Math.max(x_0, $eval(castTo($get_2(this$static.children, i), 13), es));
        return x_0;
      }

    case 21:
      return $wnd.Math.min($wnd.Math.max($eval(left, es), $eval(castTo($get_2(this$static.children, 1), 13), es)), $eval(castTo($get_2(this$static.children, 2), 13), es));
    case 26:
      {
        x_0 = $eval(left, es);
        if (!right)
          return x_0 < 0?0:1;
        return x_0 > $eval(right, es)?0:x_0 < 0?0:1;
      }

    case 27:
      {
        x_0 = $eval(left, es);
        return $eval(castTo($get_2(this$static.children, x_0 > 0?2:1), 13), es);
      }

    case 23:
      {
        x_0 = $posmod($eval(left, es)) / $intern_14;
        return x_0 < 1?-1 + x_0 * 2:3 - x_0 * 2;
      }

    case 24:
      {
        x_0 = $posmod($eval(left, es)) / $intern_14;
        return x_0 - 1;
      }

    case 25:
      return $eval(left, es) % $eval(right, es);
    case 22:
      return $pwl(es, this$static.children);
    case 28:
      return $wnd.Math.pow($wnd.Math.abs($eval(left, es)), $eval(right, es));
    case 29:
      {
        x_0 = $eval(left, es);
        if (x_0 < 0)
          return -$wnd.Math.pow(-x_0, $eval(right, es));
        return $wnd.Math.pow(x_0, $eval(right, es));
      }

    case 30:
      return es.lastOutput;
    case 31:
      return theSim.timeStep_0;
    default:if (this$static.type_0 >= 73)
        return es.lastValues[this$static.type_0 - 73];
      if (this$static.type_0 >= 63)
        return (es.values[this$static.type_0 - 63] - es.lastValues[this$static.type_0 - 63]) / theSim.timeStep_0;
      if (this$static.type_0 >= 53)
        return es.values[this$static.type_0 - 53];
      console.log('unknown\n');
  }
  return 0;
}

function $posmod(x_0){
  x_0 %= $intern_10;
  return x_0 >= 0?x_0:x_0 + $intern_10;
}

function $pwl(es, args){
  var i, x_0, x0, x1, y0, y1;
  x_0 = $eval((checkArrayElementIndex(0, args.arrayList.array.length) , castTo($get_0(args.arrayList, 0), 13)), es);
  x0 = $eval((checkArrayElementIndex(1, args.arrayList.array.length) , castTo($get_0(args.arrayList, 1), 13)), es);
  y0 = $eval((checkArrayElementIndex(2, args.arrayList.array.length) , castTo($get_0(args.arrayList, 2), 13)), es);
  if (x_0 < x0)
    return y0;
  x1 = $eval((checkArrayElementIndex(3, args.arrayList.array.length) , castTo($get_0(args.arrayList, 3), 13)), es);
  y1 = $eval((checkArrayElementIndex(4, args.arrayList.array.length) , castTo($get_0(args.arrayList, 4), 13)), es);
  i = 5;
  while (true) {
    if (x_0 < x1)
      return y0 + (x_0 - x0) * (y1 - y0) / (x1 - x0);
    if (i + 1 >= args.arrayList.array.length)
      break;
    x0 = x1;
    y0 = y1;
    x1 = $eval((checkArrayElementIndex(i, args.arrayList.array.length) , castTo($get_0(args.arrayList, i), 13)), es);
    y1 = $eval((checkArrayElementIndex(i + 1, args.arrayList.array.length) , castTo($get_0(args.arrayList, i + 1), 13)), es);
    i += 2;
  }
  return y1;
}

function Expr(v){
  this.type_0 = v;
}

function Expr_0(vv){
  this.type_0 = 6;
  this.value_0 = vv;
}

function Expr_1(e1, e2, v){
  this.children = new Vector;
  $add_2(this.children, e1);
  !!e2 && $add_2(this.children, e2);
  this.type_0 = v;
}

defineClass(13, 1, {13:1}, Expr, Expr_0, Expr_1);
_.type_0 = 0;
_.value_0 = 0;
var Lcom_lushprojects_circuitjs1_client_Expr_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'Expr', 13);
function $getToken(this$static){
  var c, i;
  while (this$static.pos < this$static.tlen && $charAt(this$static.text_0, this$static.pos) == 32)
    ++this$static.pos;
  if (this$static.pos == this$static.tlen) {
    this$static.token = '';
    return;
  }
  i = this$static.pos;
  c = $charAt(this$static.text_0, i);
  if (c >= 48 && c <= 57 || c == 46) {
    for (i = this$static.pos; i != this$static.tlen; i++) {
      if ($charAt(this$static.text_0, i) == 101 || $charAt(this$static.text_0, i) == 69) {
        ++i;
        i < this$static.tlen && ($charAt(this$static.text_0, i) == 43 || $charAt(this$static.text_0, i) == 45) && ++i;
      }
      if (!($charAt(this$static.text_0, i) >= 48 && $charAt(this$static.text_0, i) <= 57 || $charAt(this$static.text_0, i) == 46))
        break;
    }
  }
   else if (c >= 97 && c <= 122) {
    for (i = this$static.pos; i != this$static.tlen; i++) {
      if (!($charAt(this$static.text_0, i) >= 97 && $charAt(this$static.text_0, i) <= 122))
        break;
    }
  }
   else {
    ++i;
    i < this$static.tlen && ($charAt(this$static.text_0, i) == c && (c == 124 || c == 38 || c == 60 || c == 62 || c == 61)?++i:(c == 60 || c == 62 || c == 33) && $charAt(this$static.text_0, i) == 61 && ++i);
  }
  this$static.token = $substring_0(this$static.text_0, this$static.pos, i);
  this$static.pos = i;
}

function $parse_0(this$static){
  var e, e2, e3, ret;
  e = $parseOr(this$static);
  if ($skip(this$static, '?')) {
    e2 = $parseOr(this$static);
    $skip(this$static, ':') || $setError(this$static, 'expected :, got ' + this$static.token);
    e3 = $parse_0(this$static);
    ret = new Expr_1(e, e2, 32);
    $add_2(ret.children, e3);
    return ret;
  }
  return e;
}

function $parseAdd(this$static){
  var e;
  e = $parseMult(this$static);
  while (true) {
    if ($skip(this$static, '+'))
      e = new Expr_1(e, $parseMult(this$static), 1);
    else if ($skip(this$static, '-'))
      e = new Expr_1(e, $parseMult(this$static), 2);
    else 
      break;
  }
  return e;
}

function $parseAnd(this$static){
  var e;
  e = $parseBitOr(this$static);
  while ($skip(this$static, '&&')) {
    e = new Expr_1(e, $parseBitOr(this$static), 34);
  }
  return e;
}

function $parseBitAnd(this$static){
  var e;
  e = $parseEquals(this$static);
  while ($skip(this$static, '&')) {
    e = new Expr_1(e, $parseEquals(this$static), 50);
  }
  return e;
}

function $parseBitOr(this$static){
  var e;
  e = $parseBitAnd(this$static);
  while ($skip(this$static, '|')) {
    e = new Expr_1(e, $parseBitAnd(this$static), 51);
  }
  return e;
}

function $parseCompare(this$static){
  var e;
  e = $parseShift(this$static);
  if ($skip(this$static, '<='))
    return new Expr_1(e, $parseShift(this$static), 36);
  if ($skip(this$static, '>='))
    return new Expr_1(e, $parseShift(this$static), 37);
  if ($skip(this$static, '!='))
    return new Expr_1(e, $parseShift(this$static), 40);
  if ($skip(this$static, '<'))
    return new Expr_1(e, $parseShift(this$static), 38);
  if ($skip(this$static, '>'))
    return new Expr_1(e, $parseShift(this$static), 39);
  return e;
}

function $parseEquals(this$static){
  var e;
  e = $parseCompare(this$static);
  if ($skip(this$static, '=='))
    return new Expr_1(e, $parseCompare(this$static), 35);
  return e;
}

function $parseExpression(this$static){
  var e;
  if (this$static.token.length == 0)
    return new Expr_0(0);
  e = $parse_0(this$static);
  this$static.token.length > 0 && $setError(this$static, 'unexpected token: ' + this$static.token);
  return e;
}

function $parseFunc(this$static, t){
  var e;
  $skip(this$static, '(') || $setError(this$static, 'expected (, got ' + this$static.token);
  e = $parse_0(this$static);
  $skip(this$static, ')') || $setError(this$static, 'expected ), got ' + this$static.token);
  return new Expr_1(e, null, t);
}

function $parseFuncMulti(this$static, t, minArgs, maxArgs){
  var args, e, e1, enext;
  args = 1;
  $skip(this$static, '(') || $setError(this$static, 'expected (, got ' + this$static.token);
  e1 = $parse_0(this$static);
  e = new Expr_1(e1, null, t);
  while ($skip(this$static, ',')) {
    enext = $parse_0(this$static);
    $add_2(e.children, enext);
    ++args;
  }
  $skip(this$static, ')') || $setError(this$static, 'expected ), got ' + this$static.token);
  (args < minArgs || args > maxArgs) && this$static.err == null && (this$static.err = 'bad number of function args: ' + args);
  return e;
}

function $parseMult(this$static){
  var e;
  e = $parseUminus(this$static);
  while (true) {
    if ($skip(this$static, '*'))
      e = new Expr_1(e, $parseUminus(this$static), 7);
    else if ($skip(this$static, '/'))
      e = new Expr_1(e, $parseUminus(this$static), 8);
    else 
      break;
  }
  return e;
}

function $parseOr(this$static){
  var e;
  e = $parseAnd(this$static);
  while ($skip(this$static, '||')) {
    e = new Expr_1(e, $parseAnd(this$static), 33);
  }
  return e;
}

function $parsePow(this$static){
  var e;
  e = $parseTerm(this$static);
  while (true) {
    if ($skip(this$static, '^'))
      e = new Expr_1(e, $parseTerm(this$static), 9);
    else 
      break;
  }
  return e;
}

function $parseShift(this$static){
  var e;
  e = $parseAdd(this$static);
  while ($skip(this$static, '>>')) {
    e = new Expr_1(e, $parseAdd(this$static), 52);
  }
  return e;
}

function $parseTerm(this$static){
  var c, e;
  if ($skip(this$static, '(')) {
    e = $parse_0(this$static);
    $skip(this$static, ')') || $setError(this$static, 'expected ), got ' + this$static.token);
    return e;
  }
  if ($skip(this$static, 't'))
    return new Expr(3);
  if (this$static.token.length == 1) {
    c = $charAt(this$static.token, 0);
    if (c >= 97 && c <= 105) {
      $getToken(this$static);
      return new Expr(53 + (c - 97));
    }
  }
  if ($startsWith(this$static.token, 'last') && this$static.token.length == 5) {
    c = $charAt(this$static.token, 4);
    if (c >= 97 && c <= 105) {
      $getToken(this$static);
      return new Expr(73 + (c - 97));
    }
  }
  if ($endsWith(this$static.token) && $startsWith(this$static.token, 'd') && this$static.token.length == 4) {
    c = $charAt(this$static.token, 1);
    if (c >= 97 && c <= 105) {
      $getToken(this$static);
      return new Expr(63 + (c - 97));
    }
  }
  if ($skip(this$static, 'lastoutput'))
    return new Expr(30);
  if ($skip(this$static, 'timestep'))
    return new Expr(31);
  if ($skip(this$static, 'pi'))
    return new Expr_0($intern_14);
  if ($skip(this$static, 'sin'))
    return $parseFunc(this$static, 11);
  if ($skip(this$static, 'cos'))
    return $parseFunc(this$static, 12);
  if ($skip(this$static, 'asin'))
    return $parseFunc(this$static, 44);
  if ($skip(this$static, 'acos'))
    return $parseFunc(this$static, 45);
  if ($skip(this$static, 'atan'))
    return $parseFunc(this$static, 46);
  if ($skip(this$static, 'sinh'))
    return $parseFunc(this$static, 47);
  if ($skip(this$static, 'cosh'))
    return $parseFunc(this$static, 48);
  if ($skip(this$static, 'tanh'))
    return $parseFunc(this$static, 49);
  if ($skip(this$static, 'abs'))
    return $parseFunc(this$static, 13);
  if ($skip(this$static, 'exp'))
    return $parseFunc(this$static, 14);
  if ($skip(this$static, 'log'))
    return $parseFunc(this$static, 15);
  if ($skip(this$static, 'sqrt'))
    return $parseFunc(this$static, 16);
  if ($skip(this$static, 'tan'))
    return $parseFunc(this$static, 17);
  if ($skip(this$static, 'tri'))
    return $parseFunc(this$static, 23);
  if ($skip(this$static, 'saw'))
    return $parseFunc(this$static, 24);
  if ($skip(this$static, 'floor'))
    return $parseFunc(this$static, 42);
  if ($skip(this$static, 'ceil'))
    return $parseFunc(this$static, 43);
  if ($skip(this$static, 'min'))
    return $parseFuncMulti(this$static, 20, 2, 1000);
  if ($skip(this$static, 'max'))
    return $parseFuncMulti(this$static, 19, 2, 1000);
  if ($skip(this$static, 'pwl'))
    return $parseFuncMulti(this$static, 22, 2, 1000);
  if ($skip(this$static, 'mod'))
    return $parseFuncMulti(this$static, 25, 2, 2);
  if ($skip(this$static, 'step'))
    return $parseFuncMulti(this$static, 26, 1, 2);
  if ($skip(this$static, 'select'))
    return $parseFuncMulti(this$static, 27, 3, 3);
  if ($skip(this$static, 'clamp'))
    return $parseFuncMulti(this$static, 21, 3, 3);
  if ($skip(this$static, 'pwr'))
    return $parseFuncMulti(this$static, 28, 2, 2);
  if ($skip(this$static, 'pwrs'))
    return $parseFuncMulti(this$static, 29, 2, 2);
  try {
    e = new Expr_0($doubleValue(__parseAndValidateDouble(this$static.token)));
    $getToken(this$static);
    return e;
  }
   catch ($e0) {
    $e0 = toJava($e0);
    if (instanceOf($e0, 9)) {
      this$static.token.length == 0?this$static.err == null && (this$static.err = 'unexpected end of input'):$setError(this$static, 'unrecognized token: ' + this$static.token);
      return new Expr_0(0);
    }
     else 
      throw toJs($e0);
  }
}

function $parseUminus(this$static){
  $skip(this$static, '+');
  if ($skip(this$static, '!'))
    return new Expr_1($parseUminus(this$static), null, 41);
  if ($skip(this$static, '-'))
    return new Expr_1($parseUminus(this$static), null, 10);
  return $parsePow(this$static);
}

function $setError(this$static, s){
  this$static.err == null && (this$static.err = s);
}

function $skip(this$static, s){
  if ($compareTo(this$static.token, s) != 0)
    return false;
  $getToken(this$static);
  return true;
}

function ExprParser(s){
  this.text_0 = s.toLowerCase();
  this.tlen = this.text_0.length;
  this.pos = 0;
  this.err = null;
  $getToken(this);
}

defineClass(170, 1, {}, ExprParser);
_.pos = 0;
_.tlen = 0;
var Lcom_lushprojects_circuitjs1_client_ExprParser_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'ExprParser', 170);
function ExprState(){
  this.values = initUnidimensionalArray(D_classLit, $intern_7, 5, 9, 15, 1);
  this.lastValues = initUnidimensionalArray(D_classLit, $intern_7, 5, 9, 15, 1);
  this.values[4] = 2.718281828459045;
}

defineClass(169, 1, {}, ExprState);
_.lastOutput = 0;
_.t = 0;
var Lcom_lushprojects_circuitjs1_client_ExprState_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'ExprState', 169);
function FMElm(xa, ya, xb, yb, f, st){
  CircuitElm.call(this, xa, ya, xb, yb, f);
  this.lasttime = 0;
  this.funcx = 0;
  this.carrierfreq = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.signalfreq = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.maxVoltage = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.deviation = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  (this.flags & 2) != 0 && (this.flags &= -3);
  this.freqTimeZero = 0;
}

defineClass(41, 4, {4:1, 6:1, 41:1}, FMElm);
_.doStep = function doStep_13(){
  var deltaT, signalamplitude, w;
  $updateVoltageSource(this.voltSource_0, (deltaT = sim.t - this.lasttime , this.lasttime = sim.t , signalamplitude = $wnd.Math.sin($intern_10 * (sim.t - this.freqTimeZero) * this.signalfreq) , this.funcx += deltaT * (this.carrierfreq + signalamplitude * this.deviation) , w = $intern_10 * this.funcx , $wnd.Math.sin(w) * this.maxVoltage));
}
;
_.getDumpType = function getDumpType_21(){
  return 201;
}
;
_.getPostCount = function getPostCount_14(){
  return 1;
}
;
_.getVoltageDiff = function getVoltageDiff_8(){
  return this.volts[0];
}
;
_.getVoltageSourceCount = function getVoltageSourceCount_10(){
  return 1;
}
;
_.hasGroundConnection = function hasGroundConnection_6(n1){
  return true;
}
;
_.reset_0 = function reset_13(){
  this.freqTimeZero = 0;
}
;
_.setPoints = function setPoints_20(){
  $setPoints(this);
  this.lead1 = $interpPoint(this.point1, this.point2, 1 - 17 / this.dn);
}
;
_.stamp = function stamp_16(){
  $stampVoltageSource(ground, this.nodes[0], this.voltSource_0);
}
;
_.validate = function validate_8(){
  return $validateRailNode(this, 0);
}
;
_.carrierfreq = 0;
_.deviation = 0;
_.freqTimeZero = 0;
_.funcx = 0;
_.lasttime = 0;
_.maxVoltage = 0;
_.signalfreq = 0;
var Lcom_lushprojects_circuitjs1_client_FMElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'FMElm', 41);
function $checkElm(this$static, n1, ce){
  var c, j, j0, k;
  if (ce == this$static.firstElm)
    return false;
  if (this$static.type_0 == 1) {
    if (instanceOf(ce, 46))
      return false;
  }
  if (this$static.type_0 == 2) {
    if (!(ce.isWireEquivalent() || instanceOf(ce, 20) || instanceOf(ce, 81)))
      return false;
  }
  if (this$static.type_0 == 3 && !ce.isWireEquivalent())
    return false;
  if (this$static.type_0 == 4) {
    if (!(ce.isWireEquivalent() || ce.isIdealCapacitor() || instanceOf(ce, 20)))
      return false;
  }
  if (n1 == ground) {
    for (j0 = 0; j0 != ce.getPostCount(); j0++)
      if (ce.hasGroundConnection(j0) && $findPath(this$static, ce.nodes[j0]))
        return true;
  }
  for (j = 0; j != ce.getPostCount(); j++) {
    if (ce.nodes[j] == n1) {
      if (ce.hasGroundConnection(j) && $findPath(this$static, ground))
        return true;
      if (this$static.type_0 == 1 && instanceOf(ce, 80)) {
        c = ce.getCurrent();
        j == 0 && (c = -c);
        if ($wnd.Math.abs(c - this$static.firstElm.getCurrent()) > 1.0E-10)
          continue;
      }
      for (k = 0; k != ce.getPostCount(); k++) {
        if (j == k)
          continue;
        if (ce.getConnection(j, k) && $findPath(this$static, ce.nodes[k])) {
          return true;
        }
      }
    }
  }
  return false;
}

function $findPath(this$static, n1){
  var ce, cnl, i;
  if (n1 == this$static.dest)
    return true;
  if (this$static.visited[n1.index_0])
    return false;
  this$static.visited[n1.index_0] = true;
  for (i = 0; i != n1.links_0.arrayList.array.length; i++) {
    cnl = castTo($get_2(n1.links_0, i), 44);
    ce = cnl.elm;
    if ($checkElm(this$static, n1, ce))
      return true;
  }
  if (n1 == ground) {
    for (i = 0; i != this$static.sim.nodesWithGroundConnection.arrayList.array.length; i++)
      if ($checkElm(this$static, ground, castTo($get_2(this$static.sim.nodesWithGroundConnection, i), 4)))
        return true;
  }
  return false;
}

function FindPathInfo(type_, elm_, dest_, sim_){
  this.dest = dest_;
  this.type_0 = type_;
  this.firstElm = elm_;
  this.sim = sim_;
  this.visited = initUnidimensionalArray(Z_classLit, $intern_12, 5, this.sim.nodeList.arrayList.array.length, 16, 1);
}

defineClass(29, 1, {}, FindPathInfo);
_.type_0 = 0;
var Lcom_lushprojects_circuitjs1_client_FindPathInfo_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'FindPathInfo', 29);
function $setupPins_0(this$static){
  var bitsY;
  this$static.sizeX = 2;
  bitsY = this$static.bitOrder == 2?1:this$static.bits;
  this$static.sizeY = bitsY * 2 + 1;
  this$static.pins = initUnidimensionalArray(Lcom_lushprojects_circuitjs1_client_ChipElm$Pin_2_classLit, $intern_6, 12, this$static.bits * 3 + 2, 0, 1);
  $makeBitPins(this$static, this$static.bits, 0, 2, 0, 'A', false, false, false);
  $makeBitPins(this$static, this$static.bits, bitsY, 2, this$static.bits, 'B', false, false, false);
  $makeBitPins(this$static, this$static.bits, 2, 3, this$static.bits * 2, 'S', true, false, false);
  this$static.carryIn = this$static.bits * 3;
  this$static.carryOut = this$static.bits * 3 + 1;
  this$static.pins[this$static.carryOut] = new ChipElm$Pin(this$static, 0, 3, 'C');
  this$static.pins[this$static.carryOut].output = true;
  this$static.pins[this$static.carryIn] = new ChipElm$Pin(this$static, bitsY * 2, 2, 'Cin');
  $allocNodes(this$static);
}

function FullAdderElm(xa, ya, xb, yb, f, st){
  $clinit_ChipElm();
  ChipElm.call(this, xa, ya, xb, yb, f, st);
  (this.flags & 2) != 0 || (this.bits = 1);
  $setupPins_0(this);
}

defineClass(145, 18, $intern_20, FullAdderElm);
_.execute_0 = function execute_2(){
  var c, i, v;
  c = this.pins[this.carryIn].value_0?1:0;
  for (i = 0; i != this.bits; i++) {
    v = (this.pins[i].value_0?1:0) + (this.pins[i + this.bits].value_0?1:0) + c;
    c = v > 1?1:0;
    $writeOutput(this, i + this.bits * 2, (v & 1) == 1);
  }
  $writeOutput(this, this.carryOut, c == 1);
}
;
_.getDumpType = function getDumpType_22(){
  return 196;
}
;
_.getPostCount = function getPostCount_15(){
  return this.bits * 3 + 2;
}
;
_.getVoltageSourceCount = function getVoltageSourceCount_11(){
  return this.bits + 1;
}
;
_.needsBits = function needsBits_1(){
  return (this.flags & 2) != 0;
}
;
_.setupPins = function setupPins_2(){
  $setupPins_0(this);
}
;
_.carryIn = 0;
_.carryOut = 0;
var Lcom_lushprojects_circuitjs1_client_FullAdderElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'FullAdderElm', 145);
function FuseElm(xa, ya, xb, yb, f, st){
  CircuitElm.call(this, xa, ya, xb, yb, f);
  this.resistance = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.i2t = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.heat = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.blown = $booleanValue(($clinit_Boolean() , $equalsIgnoreCase($nextToken(st))));
}

defineClass(70, 4, {4:1, 6:1, 70:1}, FuseElm);
_.calculateCurrent = function calculateCurrent_9(){
  this.current_1 = (this.volts[0] - this.volts[1]) / (this.blown?$intern_31:this.resistance);
}
;
_.doStep = function doStep_14(){
  $stampResistor(this.nodes[0], this.nodes[1], this.blown?$intern_31:this.resistance);
}
;
_.getDumpType = function getDumpType_23(){
  return 404;
}
;
_.nonLinear_0 = function nonLinear_4(){
  return true;
}
;
_.reset_0 = function reset_14(){
  $reset(this);
  this.heat = 0;
  this.blown = false;
}
;
_.setPoints = function setPoints_21(){
  var llen;
  $setPoints(this);
  llen = (this.flags & 1) != 0?32:16;
  $calcLeads(this, llen);
}
;
_.stamp = function stamp_17(){
}
;
_.startIteration = function startIteration_5(){
  var i;
  i = this.current_1;
  this.heat += i * i * sim.timeStep_0;
  this.heat -= sim.timeStep_0 * this.i2t / 3;
  this.heat < 0 && (this.heat = 0);
  this.heat > this.i2t && (this.blown = true);
}
;
_.blown = false;
_.heat = 0;
_.i2t = 0;
_.resistance = 0;
var Lcom_lushprojects_circuitjs1_client_FuseElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'FuseElm', 70);
function GroundElm(xa, ya, xb, yb, f, st){
  CircuitElm.call(this, xa, ya, xb, yb, f);
  if ($hasMoreTokens(st)) {
    try {
      __parseAndValidateInt($nextToken(st), 10);
    }
     catch ($e0) {
      $e0 = toJava($e0);
      if (!instanceOf($e0, 9))
        throw toJs($e0);
    }
  }
}

defineClass(81, 4, {4:1, 6:1, 81:1}, GroundElm);
_.getConnectedPost = function getConnectedPost_1(){
  if (firstGround)
    return firstGround;
  firstGround = this.point1;
  return null;
}
;
_.getCurrentIntoNode = function getCurrentIntoNode_6(n){
  return -this.current_1;
}
;
_.getDumpType = function getDumpType_24(){
  return 103;
}
;
_.getPostCount = function getPostCount_16(){
  return 1;
}
;
_.getVoltageDiff = function getVoltageDiff_9(){
  return 0;
}
;
_.getVoltageSourceCount = function getVoltageSourceCount_12(){
  return (this.flags & 1) != 0?1:0;
}
;
_.hasGroundConnection = function hasGroundConnection_7(n1){
  return true;
}
;
_.isRemovableWire = function isRemovableWire_2(){
  return true;
}
;
_.isWireEquivalent = function isWireEquivalent_3(){
  return true;
}
;
_.setCurrent = function setCurrent_3(vs, c){
  this.current_1 = (this.flags & 1) != 0?-c:c;
}
;
_.stamp = function stamp_18(){
  (this.flags & 1) != 0 && $stampVoltageSource_0(ground, this.nodes[0], this.voltSource_0, 0);
}
;
var firstGround;
var Lcom_lushprojects_circuitjs1_client_GroundElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'GroundElm', 81);
function HalfAdderElm(xa, ya, xb, yb, f, st){
  $clinit_ChipElm();
  ChipElm.call(this, xa, ya, xb, yb, f, st);
}

defineClass(144, 18, $intern_20, HalfAdderElm);
_.execute_0 = function execute_3(){
  this.pins[0].value_0 = this.pins[2].value_0 ^ this.pins[3].value_0;
  this.pins[1].value_0 = this.pins[2].value_0 && this.pins[3].value_0;
}
;
_.getDumpType = function getDumpType_25(){
  return 195;
}
;
_.getPostCount = function getPostCount_17(){
  return 4;
}
;
_.getVoltageSourceCount = function getVoltageSourceCount_13(){
  return 2;
}
;
_.setupPins = function setupPins_3(){
  this.sizeX = 2;
  this.sizeY = 2;
  this.pins = initUnidimensionalArray(Lcom_lushprojects_circuitjs1_client_ChipElm$Pin_2_classLit, $intern_6, 12, 4, 0, 1);
  this.pins[0] = new ChipElm$Pin(this, 0, 3, 'S');
  this.pins[0].output = true;
  this.pins[1] = new ChipElm$Pin(this, 1, 3, 'C');
  this.pins[1].output = true;
  this.pins[2] = new ChipElm$Pin(this, 0, 2, 'A');
  this.pins[3] = new ChipElm$Pin(this, 1, 2, 'B');
}
;
var Lcom_lushprojects_circuitjs1_client_HalfAdderElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'HalfAdderElm', 144);
function $calcEffectiveInductance(this$static, i){
  var ratio;
  if (this$static.saturationCurrent <= 0)
    return this$static.inductance;
  ratio = i / this$static.saturationCurrent;
  return this$static.inductance / (1 + ratio * ratio);
}

function $calculateCurrent_1(this$static, voltdiff){
  this$static.compResistance > 0 && (this$static.current_0 = voltdiff / this$static.compResistance + this$static.curSourceValue);
  return this$static.current_0;
}

function $doStep_1(this$static){
  this$static.saturationCurrent > 0 && $stampConductance(this$static.nodes[0], this$static.nodes[1], 1 / this$static.compResistance);
  $stampCurrentSource(this$static.nodes[0], this$static.nodes[1], this$static.curSourceValue);
}

function $resetTo(this$static, c){
  this$static.curSourceValue = this$static.current_0 = c;
}

function $setup_1(this$static, ic, cr, f){
  this$static.inductance = ic;
  this$static.current_0 = cr;
  this$static.flags = f;
}

function $setup_2(this$static, ic, cr, f, isat){
  $setup_1(this$static, ic, cr, f);
  this$static.saturationCurrent = isat;
}

function $stamp_2(this$static, n0, n1){
  this$static.nodes[0] = n0;
  this$static.nodes[1] = n1;
  if (this$static.saturationCurrent > 0)
  ;
  else {
    (this$static.flags & 2) == 0?(this$static.compResistance = 2 * this$static.inductance / this$static.sim.timeStep_0):(this$static.compResistance = this$static.inductance / this$static.sim.timeStep_0);
    $stampResistor(this$static.nodes[0], this$static.nodes[1], this$static.compResistance);
  }
}

function $startIteration_0(this$static, voltdiff){
  var lEff;
  if (this$static.saturationCurrent > 0) {
    lEff = $calcEffectiveInductance(this$static, this$static.current_0);
    (this$static.flags & 2) == 0?(this$static.compResistance = 2 * lEff / this$static.sim.timeStep_0):(this$static.compResistance = lEff / this$static.sim.timeStep_0);
  }
  (this$static.flags & 2) == 0?(this$static.curSourceValue = voltdiff / this$static.compResistance + this$static.current_0):(this$static.curSourceValue = this$static.current_0);
}

function Inductor(s){
  this.sim = s;
  this.nodes = initUnidimensionalArray(Lcom_lushprojects_circuitjs1_client_CircuitNode_2_classLit, $intern_6, 33, 2, 0, 1);
}

defineClass(112, 1, {}, Inductor);
_.compResistance = 0;
_.curSourceValue = 0;
_.current_0 = 0;
_.flags = 0;
_.inductance = 0;
_.saturationCurrent = 0;
var Lcom_lushprojects_circuitjs1_client_Inductor_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'Inductor', 112);
function $reset_3(this$static){
  this$static.volts[0] = this$static.volts[1] = 0;
  this$static.current_1 = this$static.initialCurrent;
  $resetTo(this$static.ind, this$static.initialCurrent);
}

function InductorElm(xa, ya, xb, yb, f, st){
  CircuitElm.call(this, xa, ya, xb, yb, f);
  this.ind = new Inductor(sim);
  this.inductance = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.current_1 = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  try {
    this.initialCurrent = $doubleValue(__parseAndValidateDouble($nextToken(st)));
    this.saturationCurrent = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  }
   catch ($e0) {
    $e0 = toJava($e0);
    if (!instanceOf($e0, 9))
      throw toJs($e0);
  }
  $setup_2(this.ind, this.inductance, this.current_1, this.flags, this.saturationCurrent);
}

defineClass(80, 4, {4:1, 6:1, 80:1}, InductorElm);
_.calculateCurrent = function calculateCurrent_10(){
  var voltdiff;
  voltdiff = this.volts[0] - this.volts[1];
  this.current_1 = $calculateCurrent_1(this.ind, voltdiff);
}
;
_.doStep = function doStep_15(){
  $doStep_1(this.ind);
}
;
_.getDumpType = function getDumpType_26(){
  return 108;
}
;
_.nonLinear_0 = function nonLinear_5(){
  return this.ind.saturationCurrent > 0;
}
;
_.reset_0 = function reset_15(){
  $reset_3(this);
}
;
_.setPoints = function setPoints_22(){
  $setPoints(this);
  $calcLeads(this, 32);
}
;
_.stamp = function stamp_19(){
  $stamp_2(this.ind, this.nodes[0], this.nodes[1]);
}
;
_.startIteration = function startIteration_6(){
  $startIteration_0(this.ind, this.volts[0] - this.volts[1]);
}
;
_.validate = function validate_9(){
  var fpi;
  fpi = new FindPathInfo(1, this, this.nodes[1], sim);
  $findPath(fpi, this.nodes[0]) || $reset_3(this);
  return true;
}
;
_.inductance = 0;
_.initialCurrent = 0;
_.saturationCurrent = 0;
var Lcom_lushprojects_circuitjs1_client_InductorElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'InductorElm', 80);
function $getText(this$static, value_0){
  var close_0, ep, es, expr, exprStr, intResult, open_0, pos, result, sb;
  sb = new StringBuilder;
  pos = 0;
  while (pos < this$static.template.length) {
    open_0 = $indexOf(this$static.template, 123, pos);
    if (open_0 < 0) {
      $append_0(sb, $substring(this$static.template, pos));
      break;
    }
    $append_0(sb, $substring_0(this$static.template, pos, open_0));
    close_0 = $indexOf(this$static.template, 125, open_0);
    if (close_0 < 0) {
      $append_0(sb, $substring(this$static.template, open_0));
      break;
    }
    exprStr = $substring_0(this$static.template, open_0 + 1, close_0);
    try {
      ep = new ExprParser(exprStr);
      expr = $parseExpression(ep);
      if (ep.err == null) {
        es = new ExprState;
        es.values[0] = value_0;
        result = $eval(expr, es);
        intResult = round_int(result);
        result == intResult?(sb.string += intResult , sb):(sb.string += result , sb);
      }
       else {
        console.log('ep.got error: ' + exprStr);
        sb.string += '{' + exprStr + '}';
      }
    }
     catch ($e0) {
      $e0 = toJava($e0);
      if (instanceOf($e0, 9)) {
        sb.string += '{' + exprStr + '}';
      }
       else 
        throw toJs($e0);
    }
    pos = close_0 + 1;
  }
  return sb.string;
}

function InstructionDisplayElm$LookupEntry(lo, hi, template){
  this.lo = lo;
  this.hi = hi;
  this.template = template;
}

defineClass(100, 1, {100:1}, InstructionDisplayElm$LookupEntry);
_.hi = 0;
_.lo = 0;
var Lcom_lushprojects_circuitjs1_client_InstructionDisplayElm$LookupEntry_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'InstructionDisplayElm/LookupEntry', 100);
function InverterElm(xa, ya, xb, yb, f, st){
  CircuitElm.call(this, xa, ya, xb, yb, f);
  this.slewRate = 0.5;
  this.highVoltage = 5;
  try {
    this.slewRate = $doubleValue(__parseAndValidateDouble($nextToken(st)));
    this.highVoltage = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  }
   catch ($e0) {
    $e0 = toJava($e0);
    if (!instanceOf($e0, 9))
      throw toJs($e0);
  }
}

defineClass(88, 4, {4:1, 6:1, 88:1}, InverterElm);
_.doStep = function doStep_16(){
  var maxStep, out;
  out = this.volts[0] > this.highVoltage * 0.5?0:this.highVoltage;
  maxStep = this.slewRate * sim.timeStep_0 * $intern_31;
  out = $wnd.Math.max($wnd.Math.min(this.lastOutputVoltage + maxStep, out), this.lastOutputVoltage - maxStep);
  $updateVoltageSource(this.voltSource_0, out);
}
;
_.getConnection = function getConnection_8(n1, n2){
  return false;
}
;
_.getCurrentIntoNode = function getCurrentIntoNode_7(n){
  if (n == 1)
    return this.current_1;
  return 0;
}
;
_.getDumpType = function getDumpType_27(){
  return 73;
}
;
_.getVoltageDiff = function getVoltageDiff_10(){
  return this.volts[0];
}
;
_.getVoltageSourceCount = function getVoltageSourceCount_14(){
  return 1;
}
;
_.hasGroundConnection = function hasGroundConnection_8(n1){
  return n1 == 1;
}
;
_.setPoints = function setPoints_23(){
  var triPoints, ww;
  $setPoints(this);
  ww = 16;
  16 > this.dn / 2 && (ww = round_int(this.dn / 2));
  this.lead1 = $interpPoint(this.point1, this.point2, 0.5 - ww / this.dn);
  this.lead2 = $interpPoint(this.point1, this.point2, 0.5 + (ww + 2) / this.dn);
  $interpPoint(this.point1, this.point2, 0.5 + (ww - 2) / this.dn);
  triPoints = $newPointArray(3);
  $interpPoint2(this.lead1, this.lead2, triPoints[0], triPoints[1], 0, 16);
  triPoints[2] = $interpPoint(this.point1, this.point2, 0.5 + (ww - 5) / this.dn);
  $createPolygon_1(triPoints);
  $setBbox_0(this, this.point1, this.point2, 16);
}
;
_.stamp = function stamp_20(){
  $stampVoltageSource(ground, this.nodes[1], this.voltSource_0);
}
;
_.startIteration = function startIteration_7(){
  this.lastOutputVoltage = this.volts[1];
}
;
_.validate = function validate_10(){
  return $validateRailNode(this, 1);
}
;
_.highVoltage = 0;
_.lastOutputVoltage = 0;
_.slewRate = 0;
var Lcom_lushprojects_circuitjs1_client_InverterElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'InverterElm', 88);
function $setPoints_8(this$static){
  var triPoints, ww;
  $setPoints(this$static);
  ww = 16;
  16 > this$static.dn / 2 && (ww = round_int(this$static.dn / 2));
  this$static.lead1 = $interpPoint(this$static.point1, this$static.point2, 0.5 - ww / this$static.dn);
  this$static.lead2 = $interpPoint(this$static.point1, this$static.point2, 0.5 + (ww + 2) / this$static.dn);
  $interpPoint(this$static.point1, this$static.point2, 0.5 + (ww - 2) / this$static.dn);
  triPoints = $newPointArray(3);
  $interpPoint2(this$static.lead1, this$static.lead2, triPoints[0], triPoints[1], 0, 16);
  triPoints[2] = $interpPoint(this$static.point1, this$static.point2, 0.5 + (ww - 5) / this$static.dn);
  $createPolygon_1(triPoints);
  $getSchmittPolygon(this$static, 1, 0.30000001192092896);
  $setBbox_0(this$static, this$static.point1, this$static.point2, 16);
}

function InvertingSchmittElm(xa, ya, xb, yb, f, st){
  CircuitElm.call(this, xa, ya, xb, yb, f);
  this.slewRate = 0.5;
  this.lowerTrigger = 1.66;
  this.upperTrigger = 3.33;
  this.logicOnLevel = 5;
  this.logicOffLevel = 0;
  try {
    this.slewRate = $doubleValue(__parseAndValidateDouble($nextToken(st)));
    this.lowerTrigger = $doubleValue(__parseAndValidateDouble($nextToken(st)));
    this.upperTrigger = $doubleValue(__parseAndValidateDouble($nextToken(st)));
    this.logicOnLevel = $doubleValue(__parseAndValidateDouble($nextToken(st)));
    this.logicOffLevel = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  }
   catch ($e0) {
    $e0 = toJava($e0);
    if (!instanceOf($e0, 9))
      throw toJs($e0);
  }
}

defineClass(77, 4, $intern_32, InvertingSchmittElm);
_.doStep = function doStep_17(){
  var maxStep, out, v0;
  v0 = this.volts[1];
  if (this.state) {
    if (this.volts[0] > this.upperTrigger) {
      this.state = false;
      out = this.logicOffLevel;
    }
     else {
      out = this.logicOnLevel;
    }
  }
   else {
    if (this.volts[0] < this.lowerTrigger) {
      this.state = true;
      out = this.logicOnLevel;
    }
     else {
      out = this.logicOffLevel;
    }
  }
  maxStep = this.slewRate * sim.timeStep_0 * $intern_31;
  out = $wnd.Math.max($wnd.Math.min(v0 + maxStep, out), v0 - maxStep);
  $updateVoltageSource(this.voltSource_0, out);
}
;
_.getConnection = function getConnection_9(n1, n2){
  return false;
}
;
_.getCurrentIntoNode = function getCurrentIntoNode_8(n){
  if (n == 1)
    return this.current_1;
  return 0;
}
;
_.getDumpType = function getDumpType_28(){
  return 183;
}
;
_.getVoltageDiff = function getVoltageDiff_11(){
  return this.volts[0];
}
;
_.getVoltageSourceCount = function getVoltageSourceCount_15(){
  return 1;
}
;
_.hasGroundConnection = function hasGroundConnection_9(n1){
  return n1 == 1;
}
;
_.setPoints = function setPoints_24(){
  $setPoints_8(this);
}
;
_.stamp = function stamp_21(){
  $stampVoltageSource(ground, this.nodes[1], this.voltSource_0);
}
;
_.logicOffLevel = 0;
_.logicOnLevel = 0;
_.lowerTrigger = 0;
_.slewRate = 0;
_.state = false;
_.upperTrigger = 0;
var Lcom_lushprojects_circuitjs1_client_InvertingSchmittElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'InvertingSchmittElm', 77);
function JKFlipFlopElm(xa, ya, xb, yb, f, st){
  $clinit_ChipElm();
  ChipElm.call(this, xa, ya, xb, yb, f, st);
  this.pins[4].value_0 = !this.pins[3].value_0;
  this.justLoaded = true;
}

defineClass(147, 18, $intern_20, JKFlipFlopElm);
_.execute_0 = function execute_4(){
  var q, transition;
  if (this.justLoaded) {
    this.justLoaded = false;
    return;
  }
  (this.flags & 4) != 0?(transition = this.pins[1].value_0 && !this.lastClock):(transition = !this.pins[1].value_0 && this.lastClock);
  if (transition) {
    q = this.pins[3].value_0;
    this.pins[0].value_0?this.pins[2].value_0?(q = !q):(q = true):this.pins[2].value_0 && (q = false);
    this.pins[3].output || (console.log('pin 3 is not an output!') , undefined);
    this.pins[3].value_0 = q;
  }
  this.lastClock = this.pins[1].value_0;
  (this.flags & 2) != 0 && this.pins[5].value_0 != ((this.flags & 8) != 0) && (this.pins[3].output || (console.log('pin 3 is not an output!') , undefined) , this.pins[3].value_0 = false);
  $writeOutput(this, 4, !this.pins[3].value_0);
}
;
_.getDumpType = function getDumpType_29(){
  return 156;
}
;
_.getPostCount = function getPostCount_18(){
  return 5 + ((this.flags & 2) != 0?1:0);
}
;
_.getVoltageSourceCount = function getVoltageSourceCount_16(){
  return 2;
}
;
_.setupPins = function setupPins_4(){
  this.sizeX = 2;
  this.sizeY = 3;
  this.pins = initUnidimensionalArray(Lcom_lushprojects_circuitjs1_client_ChipElm$Pin_2_classLit, $intern_6, 12, 5 + ((this.flags & 2) != 0?1:0), 0, 1);
  this.pins[0] = new ChipElm$Pin(this, 0, 2, 'J');
  this.pins[1] = new ChipElm$Pin(this, 1, 2, '');
  this.pins[1].clock = true;
  this.pins[2] = new ChipElm$Pin(this, 2, 2, 'K');
  this.pins[3] = new ChipElm$Pin(this, 0, 3, 'Q');
  this.pins[3].output = this.pins[3].state = true;
  this.pins[4] = new ChipElm$Pin(this, 2, 3, 'Q');
  this.pins[4].output = true;
  (this.flags & 2) != 0 && (this.pins[5] = new ChipElm$Pin(this, 1, 3, 'R'));
}
;
_.justLoaded = false;
var Lcom_lushprojects_circuitjs1_client_JKFlipFlopElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'JKFlipFlopElm', 147);
function $calculate(this$static, finished){
  var Gds, drain, ids0, realvds, realvgs, rs, source, vds, vgs, vs;
  if (finished)
    vs = this$static.volts;
  else {
    vs = initUnidimensionalArray(D_classLit, $intern_7, 5, 3, 15, 1);
    vs[0] = this$static.volts[0];
    vs[1] = this$static.volts[1];
    vs[2] = this$static.volts[2];
    vs[1] > this$static.lastv1 + 0.5 && (vs[1] = this$static.lastv1 + 0.5);
    vs[1] < this$static.lastv1 - 0.5 && (vs[1] = this$static.lastv1 - 0.5);
    vs[2] > this$static.lastv2 + 0.5 && (vs[2] = this$static.lastv2 + 0.5);
    vs[2] < this$static.lastv2 - 0.5 && (vs[2] = this$static.lastv2 - 0.5);
  }
  source = 1;
  drain = 2;
  if (this$static.pnp * vs[1] > this$static.pnp * vs[2]) {
    source = 2;
    drain = 1;
  }
  vgs = vs[0] - vs[source];
  vds = vs[drain] - vs[source];
  !finished && ($nonConvergence(this$static, this$static.lastv1, vs[1]) || $nonConvergence(this$static, this$static.lastv2, vs[2]) || $nonConvergence(this$static, this$static.lastv0, vs[0])) && (sim.converged = false);
  this$static.lastv0 = vs[0];
  this$static.lastv1 = vs[1];
  this$static.lastv2 = vs[2];
  realvgs = vgs;
  realvds = vds;
  vgs *= this$static.pnp;
  vds *= this$static.pnp;
  this$static.ids = 0;
  this$static.gm = 0;
  if (vgs < this$static.vt) {
    Gds = $intern_27;
    this$static.ids = vds * $intern_27;
  }
   else if (vds < vgs - this$static.vt) {
    this$static.ids = this$static.beta_0 * ((vgs - this$static.vt) * vds - vds * vds * 0.5);
    this$static.gm = this$static.beta_0 * vds;
    Gds = this$static.beta_0 * (vgs - vds - this$static.vt);
  }
   else {
    this$static.gm = this$static.beta_0 * (vgs - this$static.vt);
    Gds = $intern_27;
    this$static.ids = 0.5 * this$static.beta_0 * (vgs - this$static.vt) * (vgs - this$static.vt) + (vds - (vgs - this$static.vt)) * $intern_27;
  }
  if ((this$static.flags & this$static.FLAG_BODY_DIODE) != 0 && this$static.showBulk()) {
    $doStep_0(this$static.diodeB1, this$static.pnp * (this$static.volts[this$static.bodyTerminal] - this$static.volts[1]));
    this$static.diodeCurrent1 = $calculateCurrent_0(this$static.diodeB1, this$static.pnp * (this$static.volts[this$static.bodyTerminal] - this$static.volts[1])) * this$static.pnp;
    $doStep_0(this$static.diodeB2, this$static.pnp * (this$static.volts[this$static.bodyTerminal] - this$static.volts[2]));
    this$static.diodeCurrent2 = $calculateCurrent_0(this$static.diodeB2, this$static.pnp * (this$static.volts[this$static.bodyTerminal] - this$static.volts[2])) * this$static.pnp;
  }
   else 
    this$static.diodeCurrent1 = this$static.diodeCurrent2 = 0;
  ids0 = this$static.ids;
  (source == 2 && this$static.pnp == 1 || source == 1 && this$static.pnp == -1) && (this$static.ids = -this$static.ids);
  if (finished)
    return;
  rs = -this$static.pnp * ids0 + Gds * realvds + this$static.gm * realvgs;
  $stampMatrix(this$static.nodes[drain], this$static.nodes[drain], Gds);
  $stampMatrix(this$static.nodes[drain], this$static.nodes[source], -Gds - this$static.gm);
  $stampMatrix(this$static.nodes[drain], this$static.nodes[0], this$static.gm);
  $stampMatrix(this$static.nodes[source], this$static.nodes[drain], -Gds);
  $stampMatrix(this$static.nodes[source], this$static.nodes[source], Gds + this$static.gm);
  $stampMatrix(this$static.nodes[source], this$static.nodes[0], -this$static.gm);
  $stampRightSide(this$static.nodes[drain], rs);
  $stampRightSide(this$static.nodes[source], -rs);
}

function $nonConvergence(this$static, last, now_0){
  var diff;
  diff = $wnd.Math.abs(last - now_0);
  this$static.beta_0 > 1 && (diff *= 100);
  if (diff < $intern_21)
    return false;
  if (sim.subIterations > 10 && diff < $wnd.Math.abs(now_0) * $intern_17)
    return false;
  if (sim.subIterations > 100 && diff < $intern_21 + (sim.subIterations - 100) * $intern_33)
    return false;
  return true;
}

function $reset_4(this$static){
  this$static.lastv1 = this$static.lastv2 = this$static.volts[0] = this$static.volts[1] = this$static.volts[2] = 0;
  this$static.diodeB1.lastvoltdiff = 0;
  this$static.diodeB2.lastvoltdiff = 0;
  (this$static.flags & this$static.FLAG_BODY_DIODE) != 0 && this$static.showBulk() && (this$static.volts[this$static.bodyTerminal] = 0);
}

function $setPoints_9(this$static){
  var a1, a2, b1, b2, dist, dp1, dp2, hs2, pa;
  $setPoints(this$static);
  this$static.flags &= ~this$static.FLAGS_GLOBAL;
  this$static.flags |= globalFlags;
  hs2 = 16 * this$static.dsign;
  (this$static.flags & this$static.FLAG_FLIP) != 0 && (hs2 = -hs2);
  this$static.src_0 = $newPointArray(3);
  this$static.drn = $newPointArray(3);
  $interpPoint2(this$static.point1, this$static.point2, this$static.src_0[0], this$static.drn[0], 1, -hs2);
  $interpPoint2(this$static.point1, this$static.point2, this$static.src_0[1], this$static.drn[1], 1 - 22 / this$static.dn, -hs2);
  $interpPoint2(this$static.point1, this$static.point2, this$static.src_0[2], this$static.drn[2], 1 - 22 / this$static.dn, -hs2 * 4 / 3 | 0);
  this$static.gate = $newPointArray(3);
  $interpPoint2(this$static.point1, this$static.point2, this$static.gate[0], this$static.gate[2], 1 - 28 / this$static.dn, hs2 / 2 | 0);
  $interpPoint_1(this$static.gate[0], this$static.gate[2], this$static.gate[1], 0.5);
  if (this$static.showBulk()) {
    this$static.body_0 = $newPointArray(2);
    $interpPoint_1(this$static.src_0[0], this$static.drn[0], this$static.body_0[0], 0.5);
    $interpPoint_1(this$static.src_0[1], this$static.drn[1], this$static.body_0[1], 0.5);
  }
  if ((this$static.flags & this$static.FLAG_DIGITAL) != 0) {
    if (this$static.pnp == -1) {
      $interpPoint_1(this$static.point1, this$static.point2, this$static.gate[1], 1 - 36 / this$static.dn);
      dist = this$static.dsign < 0?32:31;
      $interpPoint(this$static.point1, this$static.point2, 1 - dist / this$static.dn);
    }
  }
   else {
    this$static.pnp == 1?this$static.showBulk()?$calcArrow(this$static.body_0[0], this$static.body_0[1], 12, 5):$calcArrow(this$static.src_0[1], this$static.src_0[0], 10, 4):this$static.showBulk()?$calcArrow(this$static.body_0[1], this$static.body_0[0], 12, 5):$calcArrow(this$static.drn[0], this$static.drn[1], 12, 5);
  }
  if ((this$static.flags & this$static.FLAG_SHOW_BODY_DIODE) != 0 && (this$static.flags & this$static.FLAG_BODY_DIODE) != 0 && this$static.showBulk()) {
    pa = $newPointArray(2);
    if ((this$static.flags & this$static.FLAG_BODY_TERMINAL) != 0 && (this$static.flags & this$static.FLAG_BODY_DIODE) != 0 && this$static.showBulk()) {
      this$static.bodyDiodeCathode = $newPointArray(2);
      this$static.bodyDiodeCathode2 = $newPointArray(2);
      a1 = this$static.pnp == 1?this$static.body_0[0]:this$static.src_0[0];
      b1 = this$static.pnp == 1?this$static.src_0[0]:this$static.body_0[0];
      dp1 = $interpPoint(a1, b1, 0.3);
      dp2 = $interpPoint(a1, b1, 0.7);
      $interpPoint2(dp1, dp2, pa[0], pa[1], 0, 3);
      $interpPoint2(dp1, dp2, this$static.bodyDiodeCathode[0], this$static.bodyDiodeCathode[1], 1, 3);
      $createPolygon(pa[0], pa[1], dp2);
      pa = $newPointArray(2);
      a2 = this$static.pnp == 1?this$static.body_0[0]:this$static.drn[0];
      b2 = this$static.pnp == 1?this$static.drn[0]:this$static.body_0[0];
      dp1 = $interpPoint(a2, b2, 0.3);
      dp2 = $interpPoint(a2, b2, 0.7);
      $interpPoint2(dp1, dp2, pa[0], pa[1], 0, 3);
      $interpPoint2(dp1, dp2, this$static.bodyDiodeCathode2[0], this$static.bodyDiodeCathode2[1], 1, 3);
      $createPolygon(pa[0], pa[1], dp2);
    }
     else {
      this$static.bodyDiodeCathode = $newPointArray(2);
      this$static.bodyDiodeLeads = $newPointArray(4);
      dp1 = $interpPoint_0(this$static.src_0[0], this$static.drn[0], 0.3125, -hs2);
      dp2 = $interpPoint_0(this$static.src_0[0], this$static.drn[0], 0.6875, -hs2);
      $interpPoint2(dp1, dp2, pa[0], pa[1], 0, 6);
      $interpPoint2(dp1, dp2, this$static.bodyDiodeCathode[0], this$static.bodyDiodeCathode[1], 1, 6);
      $createPolygon(pa[0], pa[1], dp2);
      this$static.bodyDiodeLeads[0] = $interpPoint_0(this$static.src_0[0], this$static.drn[0], 0, -hs2);
      this$static.bodyDiodeLeads[1] = dp1;
      this$static.bodyDiodeLeads[2] = dp2;
      this$static.bodyDiodeLeads[3] = $interpPoint_0(this$static.src_0[0], this$static.drn[0], 1, -hs2);
    }
  }
}

function $stamp_3(this$static){
  (this$static.flags & this$static.FLAG_BODY_TERMINAL) != 0 && (this$static.flags & this$static.FLAG_BODY_DIODE) != 0 && this$static.showBulk()?(this$static.bodyTerminal = 3):(this$static.bodyTerminal = this$static.pnp == -1?2:1);
  if ((this$static.flags & this$static.FLAG_BODY_DIODE) != 0 && this$static.showBulk()) {
    if (this$static.pnp == -1) {
      $stamp_0(this$static.diodeB1, this$static.nodes[1], this$static.nodes[this$static.bodyTerminal]);
      $stamp_0(this$static.diodeB2, this$static.nodes[2], this$static.nodes[this$static.bodyTerminal]);
    }
     else {
      $stamp_0(this$static.diodeB1, this$static.nodes[this$static.bodyTerminal], this$static.nodes[1]);
      $stamp_0(this$static.diodeB2, this$static.nodes[this$static.bodyTerminal], this$static.nodes[2]);
    }
  }
}

function MosfetElm(xa, ya, xb, yb, f, st){
  CircuitElm.call(this, xa, ya, xb, yb, f);
  this.FLAG_PNP = 1;
  this.FLAG_DIGITAL = 4;
  this.FLAG_FLIP = 8;
  this.FLAG_HIDE_BULK = 16;
  this.FLAG_BODY_DIODE = 32;
  this.FLAG_BODY_TERMINAL = 64;
  this.FLAG_SHOW_BODY_DIODE = 128;
  this.FLAGS_GLOBAL = this.FLAG_HIDE_BULK | this.FLAG_DIGITAL | this.FLAG_SHOW_BODY_DIODE;
  this.gm = 0;
  this.pnp = (f & this.FLAG_PNP) != 0?-1:1;
  this.diodeB1 = new Diode(sim);
  $setup(this.diodeB1, getModelWithName('default'));
  this.diodeB2 = new Diode(sim);
  $setup(this.diodeB2, getModelWithName('default'));
  this.vt = this.getDefaultThreshold();
  this.beta_0 = this.getBackwardCompatibilityBeta();
  try {
    this.vt = $doubleValue(__parseAndValidateDouble($nextToken(st)));
    this.beta_0 = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  }
   catch ($e0) {
    $e0 = toJava($e0);
    if (!instanceOf($e0, 9))
      throw toJs($e0);
  }
  globalFlags = this.flags & this.FLAGS_GLOBAL;
  $allocNodes(this);
}

defineClass(51, 4, $intern_34, MosfetElm);
_.doStep = function doStep_18(){
  $calculate(this, false);
}
;
_.getBackwardCompatibilityBeta = function getBackwardCompatibilityBeta(){
  return 0.02;
}
;
_.getConnection = function getConnection_10(n1, n2){
  return !(n1 == 0 || n2 == 0);
}
;
_.getCurrent = function getCurrent_0(){
  return this.ids;
}
;
_.getCurrentIntoNode = function getCurrentIntoNode_9(n){
  if (n == 0)
    return 0;
  if (n == 3)
    return -this.diodeCurrent1 - this.diodeCurrent2;
  if (n == 1)
    return this.ids + this.diodeCurrent1;
  return -this.ids + this.diodeCurrent2;
}
;
_.getDefaultThreshold = function getDefaultThreshold(){
  return 1.5;
}
;
_.getDumpType = function getDumpType_30(){
  return 102;
}
;
_.getMatrixConnection = function getMatrixConnection_2(n1, n2){
  return true;
}
;
_.getPost = function getPost_8(n){
  return n == 0?this.point1:n == 1?this.src_0[0]:n == 2?this.drn[0]:this.body_0[0];
}
;
_.getPostCount = function getPostCount_19(){
  return (this.flags & this.FLAG_BODY_TERMINAL) != 0 && (this.flags & this.FLAG_BODY_DIODE) != 0 && this.showBulk()?4:3;
}
;
_.getVoltageDiff = function getVoltageDiff_12(){
  return this.volts[2] - this.volts[1];
}
;
_.nonLinear_0 = function nonLinear_6(){
  return true;
}
;
_.reset_0 = function reset_16(){
  $reset_4(this);
}
;
_.setPoints = function setPoints_25(){
  $setPoints_9(this);
}
;
_.showBulk = function showBulk(){
  return (this.flags & (this.FLAG_DIGITAL | this.FLAG_HIDE_BULK)) == 0;
}
;
_.stamp = function stamp_22(){
  $stamp_3(this);
}
;
_.stepFinished = function stepFinished_7(){
  $calculate(this, true);
  this.bodyTerminal == 1 && (this.diodeCurrent1 = -this.diodeCurrent2);
  this.bodyTerminal == 2 && (this.diodeCurrent2 = -this.diodeCurrent1);
}
;
_.FLAGS_GLOBAL = 0;
_.FLAG_BODY_DIODE = 0;
_.FLAG_BODY_TERMINAL = 0;
_.FLAG_DIGITAL = 0;
_.FLAG_FLIP = 0;
_.FLAG_HIDE_BULK = 0;
_.FLAG_PNP = 0;
_.FLAG_SHOW_BODY_DIODE = 0;
_.beta_0 = 0;
_.bodyTerminal = 0;
_.diodeCurrent1 = 0;
_.diodeCurrent2 = 0;
_.gm = 0;
_.ids = 0;
_.lastv0 = 0;
_.lastv1 = 0;
_.lastv2 = 0;
_.pnp = 0;
_.vt = 0;
var globalFlags = 0;
var Lcom_lushprojects_circuitjs1_client_MosfetElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'MosfetElm', 51);
function JfetElm(xa, ya, xb, yb, f, st){
  MosfetElm.call(this, xa, ya, xb, yb, f, st);
  this.diode = new Diode(sim);
  $setup(this.diode, getModelWithName('default'));
}

defineClass(138, 51, $intern_34, JfetElm);
_.calculateCurrent = function calculateCurrent_11(){
  this.gateCurrent = this.pnp * $calculateCurrent_0(this.diode, this.pnp * (this.volts[0] - this.volts[1]));
}
;
_.doStep = function doStep_19(){
  $calculate(this, false);
  $doStep_0(this.diode, this.pnp * (this.volts[0] - this.volts[1]));
}
;
_.getBackwardCompatibilityBeta = function getBackwardCompatibilityBeta_0(){
  return 0.00125;
}
;
_.getConnection = function getConnection_11(n1, n2){
  return true;
}
;
_.getCurrentIntoNode = function getCurrentIntoNode_10(n){
  if (n == 0)
    return -this.gateCurrent;
  if (n == 1)
    return this.gateCurrent + this.ids;
  return -this.ids;
}
;
_.getDefaultThreshold = function getDefaultThreshold_0(){
  return -4;
}
;
_.getDumpType = function getDumpType_31(){
  return 106;
}
;
_.reset_0 = function reset_17(){
  $reset_4(this);
  this.diode.lastvoltdiff = 0;
}
;
_.setPoints = function setPoints_26(){
  var hs2, ra, x_0;
  $setPoints_9(this);
  hs2 = 16 * this.dsign;
  this.src_0 = $newPointArray(3);
  this.drn = $newPointArray(3);
  $interpPoint2(this.point1, this.point2, this.src_0[0], this.drn[0], 1, -hs2);
  $interpPoint2(this.point1, this.point2, this.src_0[1], this.drn[1], 1, -hs2 / 2 | 0);
  $interpPoint2(this.point1, this.point2, this.src_0[2], this.drn[2], 1 - 10 / this.dn, -hs2 / 2 | 0);
  this.gatePt = $interpPoint(this.point1, this.point2, 1 - 14 / this.dn);
  ra = $newPointArray(4);
  $interpPoint2(this.point1, this.point2, ra[0], ra[1], 1 - 13 / this.dn, 16);
  $interpPoint2(this.point1, this.point2, ra[2], ra[3], 1 - 10 / this.dn, 16);
  $createPolygon_0(ra[0], ra[1], ra[3], ra[2]);
  if (this.pnp == -1) {
    x_0 = $interpPoint(this.gatePt, this.point1, 18 / this.dn);
    $calcArrow(this.gatePt, x_0, 8, 3);
  }
   else 
    $calcArrow(this.point1, this.gatePt, 8, 3);
}
;
_.showBulk = function showBulk_0(){
  return false;
}
;
_.stamp = function stamp_23(){
  $stamp_3(this);
  this.pnp < 0?$stamp_0(this.diode, this.nodes[1], this.nodes[0]):$stamp_0(this.diode, this.nodes[0], this.nodes[1]);
}
;
_.gateCurrent = 0;
var Lcom_lushprojects_circuitjs1_client_JfetElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'JfetElm', 138);
function $calcResistance(this$static, lux){
  var r;
  r = (this$static.maxLux - lux + 1) * 10;
  r = toDouble_0(fromDouble_0($wnd.Math.round(r)));
  return r;
}

function $setPoints_10(this$static){
  $setPoints(this$static);
  $calcLeads(this$static, 32);
  this$static.lux = this$static.maxLux * this$static.position + this$static.minLux;
  this$static.resistance = $calcResistance(this$static, this$static.lux);
  new Point;
  new Point;
}

function LDRElm(xa, ya, xb, yb, f, st){
  CircuitElm.call(this, xa, ya, xb, yb, f);
  this.minLux = 0.1;
  this.maxLux = 10000;
  this.position = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.lux = this.maxLux * this.position + this.minLux;
  this.resistance = $calcResistance(this, this.lux);
  unescape_0($nextToken(st));
}

defineClass(66, 4, {4:1, 6:1, 66:1}, LDRElm);
_.calculateCurrent = function calculateCurrent_12(){
  this.current_1 = (this.volts[0] - this.volts[1]) / this.resistance;
}
;
_.execute = function execute_5(){
  $setPoints_10(this);
}
;
_.getDumpType = function getDumpType_32(){
  return 374;
}
;
_.getPostCount = function getPostCount_20(){
  return 2;
}
;
_.setPoints = function setPoints_27(){
  $setPoints_10(this);
}
;
_.stamp = function stamp_24(){
  this.lux = this.maxLux * this.position + this.minLux;
  this.resistance = $calcResistance(this, this.lux);
  $stampResistor(this.nodes[0], this.nodes[1], this.resistance);
}
;
_.lux = 0;
_.maxLux = 0;
_.minLux = 0;
_.position = 0;
_.resistance = 0;
var Lcom_lushprojects_circuitjs1_client_LDRElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'LDRElm', 66);
function $setupPins_1(this$static){
  var i;
  if (this$static.sizeX == 0 || this$static.sizeY == 0) {
    this$static.sizeX = this$static.sizeY = 8;
    $allocNodes(this$static);
  }
  this$static.pins = initUnidimensionalArray(Lcom_lushprojects_circuitjs1_client_ChipElm$Pin_2_classLit, $intern_6, 12, this$static.sizeX + this$static.sizeY, 0, 1);
  for (i = 0; i != this$static.sizeX; i++)
    this$static.pins[i] = new ChipElm$Pin(this$static, i, 1, '');
  for (i = 0; i != this$static.sizeY; i++)
    this$static.pins[i + this$static.sizeX] = new ChipElm$Pin(this$static, i, 2, '');
}

function LEDArrayElm(xa, ya, xb, yb, st){
  $clinit_ChipElm();
  ChipElm.call(this, xa, ya, xb, yb, 0, st);
  try {
    this.sizeX = __parseAndValidateInt($nextToken(st), 10);
    this.sizeY = __parseAndValidateInt($nextToken(st), 10);
  }
   catch ($e0) {
    $e0 = toJava($e0);
    if (!instanceOf($e0, 9))
      throw toJs($e0);
  }
  $allocNodes(this);
  $setupPins_1(this);
  $setPoints_3(this);
}

defineClass(102, 18, {18:1, 4:1, 6:1, 102:1}, LEDArrayElm);
_.calculateCurrent = function calculateCurrent_13(){
  var cur, i, ix, iy;
  i = 0;
  for (ix = 0; ix != this.sizeX; ix++)
    this.pins[ix].current_0 = 0;
  if (this.diodes == null)
    return;
  for (iy = 0; iy != this.sizeY; iy++) {
    cur = 0;
    for (ix = 0; ix != this.sizeX; ++ix , i++) {
      this.currents[i] = $calculateCurrent_0(this.diodes[i], this.volts[this.sizeX + iy] - this.volts[ix]);
      cur += this.currents[i];
      this.pins[ix].current_0 += this.currents[i];
    }
    this.pins[iy + this.sizeX].current_0 = -cur;
  }
}
;
_.doStep = function doStep_20(){
  var i, ix, iy;
  $doStep(this);
  i = 0;
  for (iy = 0; iy != this.sizeY; iy++)
    for (ix = 0; ix != this.sizeX; ++ix , i++)
      $doStep_0(this.diodes[i], this.volts[this.sizeX + iy] - this.volts[ix]);
}
;
_.getDumpType = function getDumpType_33(){
  return 405;
}
;
_.getMatrixConnection = function getMatrixConnection_3(n1, n2){
  return true;
}
;
_.getPostCount = function getPostCount_21(){
  return this.sizeX + this.sizeY;
}
;
_.getVoltageSourceCount = function getVoltageSourceCount_17(){
  return 0;
}
;
_.nonLinear_0 = function nonLinear_7(){
  return true;
}
;
_.reset_0 = function reset_18(){
}
;
_.setupPins = function setupPins_5(){
  $setupPins_1(this);
}
;
_.stamp = function stamp_25(){
  var i, model;
  $stamp(this);
  this.diodes = initUnidimensionalArray(Lcom_lushprojects_circuitjs1_client_Diode_2_classLit, $intern_6, 27, this.sizeX * this.sizeY, 0, 1);
  model = getModelWithName('default-led');
  for (i = 0; i != this.diodes.length; i++) {
    this.diodes[i] = new Diode(sim);
    $setup(this.diodes[i], model);
    $stamp_0(this.diodes[i], this.nodes[this.sizeX + (i / this.sizeX | 0)], this.nodes[i % this.sizeX]);
  }
  this.currents = initUnidimensionalArray(D_classLit, $intern_7, 5, this.diodes.length, 15, 1);
}
;
_.stepFinished = function stepFinished_8(){
  var i;
  for (i = 0; i != this.currents.length; i++)
    $wnd.Math.abs(this.currents[i]) > $intern_25 && $stop(sim, 'max current exceeded');
}
;
var Lcom_lushprojects_circuitjs1_client_LEDArrayElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'LEDArrayElm', 102);
function LEDElm(xa, ya, xb, yb, f, st){
  DiodeElm.call(this, xa, ya, xb, yb, f, st);
  if ((f & 3) == 0) {
    this.model = getModelWithParameters(2.1024259, 0);
    this.modelName = this.model.name_0;
    console_0('model name wparams = ' + this.modelName);
    $setup_0(this);
  }
  this.colorR = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.colorG = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.colorB = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.maxBrightnessCurrent = $intern_21;
  try {
    this.maxBrightnessCurrent = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  }
   catch ($e0) {
    $e0 = toJava($e0);
    if (!instanceOf($e0, 9))
      throw toJs($e0);
  }
}

defineClass(79, 26, {4:1, 26:1, 6:1, 79:1}, LEDElm);
_.getDumpType = function getDumpType_34(){
  return 162;
}
;
_.setPoints = function setPoints_28(){
  $setPoints_7(this);
  $interpPoint(this.point1, this.point2, 0.5 - 12 / this.dn);
  $interpPoint(this.point1, this.point2, 0.5 + 12 / this.dn);
  $interpPoint(this.point1, this.point2, 0.5);
}
;
_.colorB = 0;
_.colorG = 0;
_.colorR = 0;
_.maxBrightnessCurrent = 0;
var Lcom_lushprojects_circuitjs1_client_LEDElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'LEDElm', 79);
function $getConnectedPost(this$static, n){
  var key, le, myPost;
  key = this$static.busWidth > 1?this$static.text_0 + ':' + n:this$static.text_0;
  myPost = $getPost(this$static, n);
  le = castTo($getStringValue(labelList, key), 101);
  if (le)
    return le.point;
  le = new LabeledNodeElm$LabelEntry;
  le.point = myPost;
  $putStringValue(labelList, key, le);
  return null;
}

function $getPost(this$static, n){
  if (this$static.busWidth == 1)
    return this$static.point1;
  return new Point_1(this$static.point1.x_0, this$static.point1.y_0, n);
}

function LabeledNodeElm(xa, ya, xb, yb, st){
  CircuitElm.call(this, xa, ya, xb, yb, 4);
  this.busWidth = 1;
  this.text_0 = $nextToken(st);
  if ((this.flags & 4) == 0) {
    while ($hasMoreTokens(st))
      this.text_0 += ' ' + $nextToken(st);
  }
   else {
    this.text_0 = unescape_0(this.text_0);
  }
}

defineClass(56, 4, {4:1, 6:1, 56:1}, LabeledNodeElm);
_.getBusWidth = function getBusWidth_0(){
  return this.busWidth;
}
;
_.getConnectedPost = function getConnectedPost_2(){
  return $getConnectedPost(this, 0);
}
;
_.getConnectedPost_0 = function getConnectedPost_3(n){
  return $getConnectedPost(this, n);
}
;
_.getConnection = function getConnection_12(n1, n2){
  return n1 == n2;
}
;
_.getCurrentIntoNode = function getCurrentIntoNode_11(n){
  if (this.currents != null)
    return -this.currents[n];
  return -this.current_1;
}
;
_.getDumpType = function getDumpType_35(){
  return 207;
}
;
_.getPost = function getPost_9(n){
  return $getPost(this, n);
}
;
_.getPostCount = function getPostCount_22(){
  return this.busWidth;
}
;
_.getPostWidth = function getPostWidth_3(n){
  return this.busWidth;
}
;
_.getVoltageDiff = function getVoltageDiff_13(){
  return this.volts[0];
}
;
_.getWireSegments = function getWireSegments_0(list){
  var b, ep0, ep1;
  for (b = 0; b < this.busWidth; b++) {
    ep0 = pointKey($getPost(this, b));
    ep1 = this.busWidth > 1?'label:' + this.text_0 + ':' + b:'label:' + this.text_0;
    $add_2(list, new SimulationManager$WireSegment(this, b, ep0, ep1));
  }
}
;
_.isRemovableWire = function isRemovableWire_3(){
  return true;
}
;
_.isWireEquivalent = function isWireEquivalent_4(){
  return true;
}
;
_.setCurrent = function setCurrent_4(vs, c){
  this.current_1 = c;
}
;
_.setNode = function setNode_0(p, n){
  var key;
  this.nodes[p] = n;
  key = this.busWidth > 1?this.text_0 + ':' + p:this.text_0;
  castTo($getStringValue(labelList, key), 101);
}
;
_.setPoints = function setPoints_29(){
  $setPoints(this);
  this.lead1 = $interpPoint(this.point1, this.point2, 1 - 17 / this.dn);
}
;
_.setWireCurrent = function setWireCurrent_0(bit, c){
  this.currents != null?(this.currents[bit] = c):(this.current_1 = c);
}
;
_.busWidth = 0;
var labelList;
var Lcom_lushprojects_circuitjs1_client_LabeledNodeElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'LabeledNodeElm', 56);
function LabeledNodeElm$LabelEntry(){
}

defineClass(101, 1, {101:1}, LabeledNodeElm$LabelEntry);
var Lcom_lushprojects_circuitjs1_client_LabeledNodeElm$LabelEntry_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'LabeledNodeElm/LabelEntry', 101);
function $startIteration_1(this$static){
  var cap, capc, capw, cr, nom_r, tp;
  nom_r = this$static.nom_v * this$static.nom_v / this$static.nom_pow;
  tp = this$static.temp > 5390?5390:this$static.temp;
  this$static.resistance = nom_r * (1.26104 - 4.90662 * $wnd.Math.sqrt(17.1839 / tp - 0.00318794) - 7.8569 / (tp - 187.56));
  cap = 1.57E-4 * this$static.nom_pow;
  capw = cap * this$static.warmTime / 0.4;
  capc = cap * this$static.coolTime / 0.4;
  this$static.temp += (this$static.volts[0] - this$static.volts[1]) * this$static.current_1 * sim.timeStep_0 / capw;
  cr = 2600 / this$static.nom_pow;
  this$static.temp -= sim.timeStep_0 * (this$static.temp - 300) / (capc * cr);
}

function LampElm(xa, ya, xb, yb, st){
  CircuitElm.call(this, xa, ya, xb, yb, 0);
  this.temp = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  isNaN(this.temp) && (this.temp = 300);
  this.nom_pow = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.nom_v = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.warmTime = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.coolTime = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  $startIteration_1(this);
}

defineClass(59, 4, {4:1, 6:1, 59:1}, LampElm);
_.calculateCurrent = function calculateCurrent_14(){
  this.current_1 = (this.volts[0] - this.volts[1]) / this.resistance;
  this.resistance == 0 && (this.current_1 = 0);
}
;
_.doStep = function doStep_21(){
  $stampResistor(this.nodes[0], this.nodes[1], this.resistance);
}
;
_.getDumpType = function getDumpType_36(){
  return 181;
}
;
_.nonLinear_0 = function nonLinear_8(){
  return true;
}
;
_.reset_0 = function reset_19(){
  $reset(this);
  this.temp = 300;
  $startIteration_1(this);
}
;
_.setPoints = function setPoints_30(){
  var br;
  $setPoints(this);
  $calcLeads(this, 16);
  this.bulbLead = $newPointArray(2);
  this.filament = $newPointArray(2);
  this.bulbR = 20;
  this.filament[0] = $interpPoint_0(this.lead1, this.lead2, 0, 24);
  this.filament[1] = $interpPoint_0(this.lead1, this.lead2, 1, 24);
  br = 24 - $wnd.Math.sqrt(this.bulbR * this.bulbR - 256);
  this.bulbLead[0] = $interpPoint_0(this.lead1, this.lead2, 0, br);
  this.bulbLead[1] = $interpPoint_0(this.lead1, this.lead2, 1, br);
  $interpPoint(this.filament[0], this.filament[1], 0.5);
}
;
_.stamp = function stamp_26(){
}
;
_.startIteration = function startIteration_8(){
  $startIteration_1(this);
}
;
_.bulbR = 0;
_.coolTime = 0;
_.nom_pow = 0;
_.nom_v = 0;
_.resistance = 0;
_.temp = 0;
_.warmTime = 0;
var Lcom_lushprojects_circuitjs1_client_LampElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'LampElm', 59);
function $doLoad(this$static){
  var i, i0, inputEnabled;
  if ((this$static.flags & 16) != 0 && this$static.pins[this$static.setPin].value_0) {
    for (i0 = 0; i0 != this$static.bits; i0++)
      this$static.outputValues[i0] = true;
    this$static.lastLoad = this$static.pins[this$static.loadPin].value_0;
    return;
  }
  if ((this$static.flags & 8) != 0 && this$static.pins[this$static.resetPin].value_0) {
    for (i0 = 0; i0 != this$static.bits; i0++)
      this$static.outputValues[i0] = false;
    this$static.lastLoad = this$static.pins[this$static.loadPin].value_0;
    return;
  }
  inputEnabled = true;
  (this$static.flags & 96) >> 5 >= 1 && this$static.pins[this$static.ie1Pin].value_0 && (inputEnabled = false);
  (this$static.flags & 96) >> 5 >= 2 && this$static.pins[this$static.ie2Pin].value_0 && (inputEnabled = false);
  if (inputEnabled && this$static.pins[this$static.loadPin].value_0 && ((this$static.flags & 4) != 0 || !this$static.lastLoad))
    for (i = 0; i != this$static.bits; i++)
      this$static.outputValues[i] = this$static.pins[i].value_0;
  this$static.lastLoad = this$static.pins[this$static.loadPin].value_0;
}

function $restoreOutputValues(this$static){
  var i, ov;
  ov = (this$static.outputValues == null && (this$static.outputValues = initUnidimensionalArray(Z_classLit, $intern_12, 5, this$static.bits, 16, 1)) , this$static.outputValues);
  for (i = 0; i != this$static.bits; i++)
    ov[i] = this$static.pins[i + this$static.bits].value_0;
}

function $setupPins_2(this$static){
  var bitsY, extraLeftPins, ieCount, leftPos, oeCount, pinIndex, rightPos;
  this$static.sizeX = 2;
  ieCount = (this$static.flags & 96) >> 5;
  oeCount = (this$static.flags & 96) >> 5;
  extraLeftPins = ((this$static.flags & 8) != 0?1:0) + ((this$static.flags & 16) != 0?1:0) + ieCount;
  bitsY = this$static.bitOrder == 2?1:this$static.bits;
  this$static.sizeY = bitsY + 1 + extraLeftPins > bitsY + oeCount?bitsY + 1 + extraLeftPins:bitsY + oeCount;
  this$static.pins = initUnidimensionalArray(Lcom_lushprojects_circuitjs1_client_ChipElm$Pin_2_classLit, $intern_6, 12, this$static.bits * 2 + 1 + ((this$static.flags & 8) != 0?1:0) + ((this$static.flags & 16) != 0?1:0) + ((this$static.flags & 96) >> 5) + ((this$static.flags & 96) >> 5), 0, 1);
  $makeBitPins(this$static, this$static.bits, 0, 2, 0, 'I', false, false, false);
  $makeBitPins(this$static, this$static.bits, 0, 3, this$static.bits, 'O', (this$static.flags & 96) >> 5 <= 0, (this$static.flags & 2) != 0, false);
  pinIndex = this$static.bits * 2;
  leftPos = bitsY;
  this$static.pins[this$static.loadPin = pinIndex++] = new ChipElm$Pin(this$static, leftPos++, 2, (this$static.flags & 4) == 0?'':'Ld');
  this$static.pins[this$static.loadPin].clock = (this$static.flags & 4) == 0;
  (this$static.flags & 8) != 0 && (this$static.pins[this$static.resetPin = pinIndex++] = new ChipElm$Pin(this$static, leftPos++, 2, 'R'));
  (this$static.flags & 16) != 0 && (this$static.pins[this$static.setPin = pinIndex++] = new ChipElm$Pin(this$static, leftPos++, 2, 'S'));
  rightPos = leftPos;
  ieCount >= 1 && (this$static.pins[this$static.ie1Pin = pinIndex++] = new ChipElm$Pin(this$static, leftPos++, 2, 'IE'));
  ieCount >= 2 && (this$static.pins[this$static.ie2Pin = pinIndex++] = new ChipElm$Pin(this$static, leftPos++, 2, 'IE'));
  oeCount >= 1 && (this$static.pins[this$static.oe1Pin = pinIndex++] = new ChipElm$Pin(this$static, rightPos++, 3, 'OE'));
  oeCount >= 2 && (this$static.pins[this$static.oe2Pin = pinIndex++] = new ChipElm$Pin(this$static, rightPos++, 3, 'OE'));
  this$static.intNodes = pinIndex;
  $allocNodes(this$static);
}

function LatchElm(xa, ya, xb, yb, f, st){
  $clinit_ChipElm();
  ChipElm.call(this, xa, ya, xb, yb, f, st);
  this.lastLoad = false;
  if ((this.flags & 2) == 0) {
    this.flags |= 2;
    $setupPins_2(this);
  }
  $restoreOutputValues(this);
}

defineClass(143, 18, $intern_20, LatchElm);
_.doStep = function doStep_22(){
  var i, outputEnabled, v;
  if ((this.flags & 96) >> 5 <= 0) {
    $doStep(this);
    return;
  }
  outputEnabled = true;
  (this.flags & 96) >> 5 >= 1 && this.pins[this.oe1Pin].value_0 && (outputEnabled = false);
  (this.flags & 96) >> 5 >= 2 && this.pins[this.oe2Pin].value_0 && (outputEnabled = false);
  for (i = 0; i < this.bits; i++) {
    v = (this.outputValues == null && (this.outputValues = initUnidimensionalArray(Z_classLit, $intern_12, 5, this.bits, 16, 1)) , this.outputValues)[i]?this.highVoltage:0;
    $updateVoltageSource(this.vSources[i], v);
    outputEnabled?$stampResistor(this.nodes[this.intNodes + i], this.nodes[this.bits + i], 1):$stampResistor(this.nodes[this.bits + i], ground, $intern_19);
  }
}
;
_.execute_0 = function execute_6(){
  var i;
  $doLoad(this);
  for (i = 0; i != this.bits; i++)
    this.pins[i + this.bits].value_0 = (this.outputValues == null && (this.outputValues = initUnidimensionalArray(Z_classLit, $intern_12, 5, this.bits, 16, 1)) , this.outputValues)[i];
}
;
_.getConnection = function getConnection_13(n1, n2){
  return false;
}
;
_.getDumpType = function getDumpType_37(){
  return 168;
}
;
_.getInternalNodeCount = function getInternalNodeCount_5(){
  return (this.flags & 96) >> 5 > 0?this.bits:0;
}
;
_.getMatrixConnection = function getMatrixConnection_4(n1, n2){
  var i;
  if ((this.flags & 96) >> 5 > 0) {
    for (i = 0; i < this.bits; i++)
      if ($comparePair(n1, n2, this.intNodes + i, this.bits + i))
        return true;
  }
  return false;
}
;
_.getPostCount = function getPostCount_23(){
  return this.bits * 2 + 1 + ((this.flags & 8) != 0?1:0) + ((this.flags & 16) != 0?1:0) + ((this.flags & 96) >> 5) + ((this.flags & 96) >> 5);
}
;
_.getVoltageSourceCount = function getVoltageSourceCount_18(){
  return this.bits;
}
;
_.hasGroundConnection = function hasGroundConnection_10(n1){
  if ((this.flags & 96) >> 5 > 0)
    return n1 >= this.bits && n1 < this.bits * 2;
  return this.pins[n1].output;
}
;
_.needsBits = function needsBits_2(){
  return true;
}
;
_.nonLinear_0 = function nonLinear_9(){
  return (this.flags & 96) >> 5 > 0;
}
;
_.reset_0 = function reset_20(){
  $reset_1(this);
  this.outputValues = null;
}
;
_.setVoltageSource = function setVoltageSource_6(j, vs){
  if ((this.flags & 96) >> 5 > 0) {
    (this.vSources == null || this.vSources.length != this.bits) && (this.vSources = initUnidimensionalArray(Lcom_lushprojects_circuitjs1_client_VoltageSource_2_classLit, $intern_6, 34, this.bits, 0, 1));
    this.vSources[j] = vs;
    $setNodes(vs, ground, this.nodes[this.intNodes + j]);
  }
   else {
    $setVoltageSource(this, j, vs);
  }
}
;
_.setupPins = function setupPins_6(){
  $setupPins_2(this);
}
;
_.stamp = function stamp_27(){
  var i;
  if ((this.flags & 96) >> 5 <= 0) {
    $stamp(this);
    return;
  }
  for (i = 0; i < this.bits; i++) {
    $stampVoltageSource(ground, this.nodes[this.intNodes + i], this.vSources[i]);
  }
}
;
_.startIteration = function startIteration_9(){
  var i, p;
  if ((this.flags & 96) >> 5 <= 0) {
    $startIteration(this);
    return;
  }
  for (i = 0; i < this.bits * 2 + 1 + ((this.flags & 8) != 0?1:0) + ((this.flags & 16) != 0?1:0) + ((this.flags & 96) >> 5) + ((this.flags & 96) >> 5); i++) {
    p = this.pins[i];
    p.output || (p.value_0 = this.volts[i] > this.highVoltage / 2);
  }
  $doLoad(this);
}
;
_.ie1Pin = 0;
_.ie2Pin = 0;
_.intNodes = 0;
_.lastLoad = false;
_.loadPin = 0;
_.oe1Pin = 0;
_.oe2Pin = 0;
_.resetPin = 0;
_.setPin = 0;
var Lcom_lushprojects_circuitjs1_client_LatchElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'LatchElm', 143);
function LogicInputElm(xa, ya, xb, yb, f, st){
  SwitchElm.call(this, xa, ya, xb, yb, f, st);
  try {
    this.hiV = $doubleValue(__parseAndValidateDouble($nextToken(st)));
    this.loV = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  }
   catch ($e0) {
    $e0 = toJava($e0);
    if (instanceOf($e0, 9)) {
      this.hiV = 5;
      this.loV = 0;
    }
     else 
      throw toJs($e0);
  }
}

defineClass(40, 21, {4:1, 6:1, 40:1, 21:1}, LogicInputElm);
_.calculateCurrent = function calculateCurrent_15(){
}
;
_.doStep = function doStep_23(){
  var v;
  v = this.position == 0?this.loV:this.hiV;
  (this.flags & 1) != 0 && (v = this.loV + this.position * (this.hiV - this.loV) * 0.5);
  $updateVoltageSource(this.voltSource_0, v);
}
;
_.getCurrentIntoNode = function getCurrentIntoNode_12(n){
  return this.current_1;
}
;
_.getDumpType = function getDumpType_38(){
  return 76;
}
;
_.getPostCount = function getPostCount_24(){
  return 1;
}
;
_.getVoltageDiff = function getVoltageDiff_14(){
  return this.volts[0];
}
;
_.getVoltageSourceCount = function getVoltageSourceCount_19(){
  return 1;
}
;
_.hasGroundConnection = function hasGroundConnection_11(n1){
  return true;
}
;
_.isRemovableWire = function isRemovableWire_4(){
  return false;
}
;
_.isWireEquivalent = function isWireEquivalent_5(){
  return false;
}
;
_.setCurrent = function setCurrent_5(vs, c){
  this.current_1 = c;
}
;
_.setPoints = function setPoints_31(){
  $setPoints_6(this);
  this.lead1 = $interpPoint(this.point1, this.point2, 1 - 12 / this.dn);
}
;
_.stamp = function stamp_28(){
  $stampVoltageSource(ground, this.nodes[0], this.voltSource_0);
}
;
_.validate = function validate_11(){
  return $validateRailNode(this, 0);
}
;
_.hiV = 0;
_.loV = 0;
var Lcom_lushprojects_circuitjs1_client_LogicInputElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'LogicInputElm', 40);
function LogicOutputElm(xa, ya, xb, yb, f, st){
  CircuitElm.call(this, xa, ya, xb, yb, f);
  try {
    this.threshold = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  }
   catch ($e0) {
    $e0 = toJava($e0);
    if (instanceOf($e0, 9)) {
      this.threshold = 2.5;
    }
     else 
      throw toJs($e0);
  }
}

defineClass(89, 4, {4:1, 6:1, 89:1}, LogicOutputElm);
_.getDumpType = function getDumpType_39(){
  return 77;
}
;
_.getPostCount = function getPostCount_25(){
  return 1;
}
;
_.getVoltageDiff = function getVoltageDiff_15(){
  return this.volts[0];
}
;
_.hasGroundConnection = function hasGroundConnection_12(n1){
  return (this.flags & 4) != 0;
}
;
_.setPoints = function setPoints_32(){
  $setPoints(this);
  this.lead1 = $interpPoint(this.point1, this.point2, 1 - 12 / this.dn);
}
;
_.stamp = function stamp_29(){
  (this.flags & 4) != 0 && $stampResistor(this.nodes[0], ground, $intern_29);
}
;
_.threshold = 0;
var Lcom_lushprojects_circuitjs1_client_LogicOutputElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'LogicOutputElm', 89);
function MBBSwitchElm(xa, ya, xb, yb, f, st){
  SwitchElm.call(this, xa, ya, xb, yb, f, st);
  this.link_0 = (new Integer_0($nextToken(st))).value_0;
  this.voltSources = initUnidimensionalArray(Lcom_lushprojects_circuitjs1_client_VoltageSource_2_classLit, $intern_6, 34, 2, 0, 1);
  this.currents = initUnidimensionalArray(D_classLit, $intern_7, 5, 2, 15, 1);
}

defineClass(55, 21, {4:1, 6:1, 55:1, 21:1}, MBBSwitchElm);
_.calculateCurrent = function calculateCurrent_16(){
  if (this.resistance > 0) {
    this.currents[0] = this.both || this.position == 0?(this.volts[0] - this.volts[1]) / this.resistance:0;
    this.currents[1] = this.both || this.position == 2?(this.volts[0] - this.volts[2]) / this.resistance:0;
    return;
  }
  this.both || (this.currents[1 - (this.position / 2 | 0)] = 0);
}
;
_.getConnection = function getConnection_14(n1, n2){
  if (this.both)
    return true;
  return $comparePair(n1, n2, 0, 1 + (this.position / 2 | 0));
}
;
_.getCurrentIntoNode = function getCurrentIntoNode_13(n){
  if (n == 0)
    return -this.currents[0] - this.currents[1];
  return this.currents[n - 1];
}
;
_.getDumpType = function getDumpType_40(){
  return 416;
}
;
_.getPost = function getPost_10(n){
  return n == 0?this.point1:this.swposts[n - 1];
}
;
_.getPostCount = function getPostCount_26(){
  return 3;
}
;
_.getVoltageSourceCount = function getVoltageSourceCount_20(){
  this.both = this.position == 1 || this.position == 3;
  if (this.resistance > 0)
    return 0;
  return this.both?2:1;
}
;
_.isRemovableWire = function isRemovableWire_5(){
  return false;
}
;
_.isWireEquivalent = function isWireEquivalent_6(){
  return this.resistance == 0;
}
;
_.setCurrent = function setCurrent_6(vs, c){
  vs == this.voltSources[0]?(this.currents[this.both?0:this.position / 2 | 0] = c):vs == this.voltSources[1] && (this.currents[1] = c);
}
;
_.setPoints = function setPoints_33(){
  var hs, i;
  $setPoints_6(this);
  $calcLeads(this, 32);
  this.swposts = $newPointArray(2);
  this.swpoles = $newPointArray(4);
  for (i = 0; i != 2; i++) {
    hs = -16 * i;
    i == 0 && (hs = 16);
    $interpPoint_2(this.lead1, this.lead2, this.swpoles[i], 1, hs);
    $interpPoint_2(this.point1, this.point2, this.swposts[i], 1, hs);
  }
}
;
_.setVoltageSource = function setVoltageSource_7(n, v){
  this.voltSources[n] = v;
  this.both?$setNodes(v, this.nodes[0], this.nodes[n + 1]):this.position == 0?$setNodes(v, this.nodes[0], this.nodes[1]):$setNodes(v, this.nodes[0], this.nodes[2]);
}
;
_.stamp = function stamp_30(){
  var vs;
  if (this.resistance > 0) {
    (this.both || this.position == 0) && $stampResistor(this.nodes[0], this.nodes[1], this.resistance);
    (this.both || this.position == 2) && $stampResistor(this.nodes[0], this.nodes[2], this.resistance);
    return;
  }
  vs = 0;
  (this.both || this.position == 0) && $stampVoltageSource_1(this.voltSources[vs++]);
  (this.both || this.position == 2) && $stampVoltageSource_1(this.voltSources[vs++]);
}
;
_.validate = function validate_12(){
  var b, fpi;
  if (this.resistance > 0)
    return true;
  b = this.position == 1 || this.position == 3;
  if (b || this.position == 0) {
    fpi = new FindPathInfo(2, this, this.nodes[0], sim);
    if ($findPath(fpi, this.nodes[1])) {
      this.resistance = $intern_17;
      return false;
    }
  }
  if (b || this.position == 2) {
    fpi = new FindPathInfo(2, this, this.nodes[0], sim);
    if ($findPath(fpi, this.nodes[2])) {
      this.resistance = $intern_17;
      return false;
    }
  }
  return true;
}
;
_.both = false;
_.link_0 = 0;
var Lcom_lushprojects_circuitjs1_client_MBBSwitchElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'MBBSwitchElm', 55);
function MemristorElm(xa, ya, xb, yb, f, st){
  CircuitElm.call(this, xa, ya, xb, yb, f);
  this.r_on = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.r_off = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.dopeWidth = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.totalWidth = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.mobility = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  try {
    this.current_1 = __parseAndValidateDouble($nextToken(st));
  }
   catch ($e0) {
    $e0 = toJava($e0);
    if (!instanceOf($e0, 9))
      throw toJs($e0);
  }
  this.resistance = 100;
}

defineClass(71, 4, {4:1, 6:1, 71:1}, MemristorElm);
_.calculateCurrent = function calculateCurrent_17(){
  this.current_1 = (this.volts[0] - this.volts[1]) / this.resistance;
}
;
_.doStep = function doStep_24(){
  $stampResistor(this.nodes[0], this.nodes[1], this.resistance);
}
;
_.getDumpType = function getDumpType_41(){
  return 109;
}
;
_.nonLinear_0 = function nonLinear_10(){
  return true;
}
;
_.reset_0 = function reset_21(){
  this.dopeWidth = 0;
}
;
_.setPoints = function setPoints_34(){
  $setPoints(this);
  $calcLeads(this, 32);
  new Point;
  new Point;
}
;
_.stamp = function stamp_31(){
}
;
_.startIteration = function startIteration_10(){
  var wd;
  wd = this.dopeWidth / this.totalWidth;
  this.dopeWidth += sim.timeStep_0 * this.mobility * this.r_on * this.current_1 / this.totalWidth;
  this.dopeWidth < 0 && (this.dopeWidth = 0);
  this.dopeWidth > this.totalWidth && (this.dopeWidth = this.totalWidth);
  this.resistance = this.r_on * wd + this.r_off * (1 - wd);
}
;
_.dopeWidth = 0;
_.mobility = 0;
_.r_off = 0;
_.r_on = 0;
_.resistance = 0;
_.totalWidth = 0;
var Lcom_lushprojects_circuitjs1_client_MemristorElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'MemristorElm', 71);
function NandGateElm(xa, ya, xb, yb, f, st){
  AndGateElm.call(this, xa, ya, xb, yb, f, st);
}

defineClass(139, 119, $intern_13, NandGateElm);
_.getDumpType = function getDumpType_42(){
  return 151;
}
;
_.isInverting = function isInverting_0(){
  return true;
}
;
var Lcom_lushprojects_circuitjs1_client_NandGateElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'NandGateElm', 139);
function NoiseElm(xa, ya, xb, yb, f, st){
  RailElm.call(this, xa, ya, xb, yb, f, st);
  this.waveform = 6;
}

defineClass(166, 38, $intern_18, NoiseElm);
var Lcom_lushprojects_circuitjs1_client_NoiseElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'NoiseElm', 166);
function OrGateElm(xa, ya, xb, yb, f, st){
  GateElm.call(this, xa, ya, xb, yb, f, st);
}

defineClass(105, 24, $intern_13, OrGateElm);
_.calcFunction = function calcFunction_0(){
  var f, i;
  f = false;
  for (i = 0; i != this.inputCount; i++)
    f = f | $getInput(this, i);
  return f;
}
;
_.getDumpType = function getDumpType_43(){
  return 152;
}
;
_.getLeadAdjustment = function getLeadAdjustment_0(ix){
  if (this.inputCount > 3 && (ix == 0 || ix == this.inputCount - 1))
    return -0.05;
  if (this.inputCount > 7 && (ix == 1 || ix == this.inputCount - 2))
    return -0.05;
  if (this.inputCount >= 12 && (ix == 2 || ix == this.inputCount - 3))
    return -0.05;
  return 0;
}
;
_.setPoints = function setPoints_35(){
  var triPoints, ww2;
  $setPoints_1(this);
  triPoints = $newPointArray(11);
  $interpPoint2(this.lead1, this.lead2, triPoints[0], triPoints[6], -0.05, this.hs2);
  $interpPoint2(this.lead1, this.lead2, triPoints[1], triPoints[5], 0.3, this.hs2);
  triPoints[3] = this.lead2;
  $interpPoint2(this.lead1, this.lead2, triPoints[2], triPoints[4], 0.7, this.hs2 * 0.81);
  $interpPoint_1(this.lead1, this.lead2, triPoints[7], 0.08);
  if (instanceOf(this, 87)) {
    ww2 = this.ww == 0?this.dn * 2:this.ww * 2;
    $interpPoint2(this.lead1, this.lead2, triPoints[8], triPoints[9], -0.05 - 5 / ww2, this.hs2);
    $interpPoint_1(this.lead1, this.lead2, triPoints[10], 0.08 - 5 / ww2);
  }
  $createPolygon_1(triPoints);
  if (this.isInverting()) {
    $interpPoint(this.point1, this.point2, 0.5 + (this.ww + 4) / this.dn);
    this.lead2 = $interpPoint(this.point1, this.point2, 0.5 + (this.ww + 8) / this.dn);
  }
}
;
var Lcom_lushprojects_circuitjs1_client_OrGateElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'OrGateElm', 105);
function NorGateElm(xa, ya, xb, yb, f, st){
  OrGateElm.call(this, xa, ya, xb, yb, f, st);
}

defineClass(140, 105, $intern_13, NorGateElm);
_.getDumpType = function getDumpType_44(){
  return 153;
}
;
_.isInverting = function isInverting_1(){
  return true;
}
;
var Lcom_lushprojects_circuitjs1_client_NorGateElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'NorGateElm', 140);
function OhmMeterElm(xa, ya, xb, yb, st){
  CurrentElm.call(this, xa, ya, xb, yb, 0, st);
}

defineClass(111, 46, {4:1, 46:1, 6:1, 111:1}, OhmMeterElm);
_.getDumpType = function getDumpType_45(){
  return 216;
}
;
_.setPoints = function setPoints_36(){
  $setPoints_4(this);
  $calcLeads(this, 26);
}
;
var Lcom_lushprojects_circuitjs1_client_OhmMeterElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'OhmMeterElm', 111);
function $setGain(this$static){
  if ((this$static.flags & 8) != 0)
    return;
  this$static.gain = (this$static.flags & 4) != 0?1000:$intern_28;
}

function OpAmpElm(xa, ya, xb, yb, f, st){
  CircuitElm.call(this, xa, ya, xb, yb, f);
  this.maxOut = 15;
  this.minOut = -15;
  this.gbw = $intern_29;
  try {
    this.maxOut = $doubleValue(__parseAndValidateDouble($nextToken(st)));
    this.minOut = $doubleValue(__parseAndValidateDouble($nextToken(st)));
    this.gbw = $doubleValue(__parseAndValidateDouble($nextToken(st)));
    this.volts[0] = $doubleValue(__parseAndValidateDouble($nextToken(st)));
    this.volts[1] = $doubleValue(__parseAndValidateDouble($nextToken(st)));
    this.gain = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  }
   catch ($e0) {
    $e0 = toJava($e0);
    if (!instanceOf($e0, 9))
      throw toJs($e0);
  }
  this.opheight = 8 * ((f & 2) != 0?1:2);
  this.opwidth = 13 * ((f & 2) != 0?1:2);
  this.flags = this.flags & -3 | (((f & 2) != 0?1:2) == 1?2:0);
  $setGain(this);
}

defineClass(92, 4, {4:1, 6:1, 92:1}, OpAmpElm);
_.doStep = function doStep_25(){
  var dx, maxAdj, midpoint, minAdj, vd, x_0;
  vd = this.volts[1] - this.volts[0];
  midpoint = (this.maxOut + this.minOut) * 0.5;
  $wnd.Math.abs(this.lastvd - vd) > 0.1?(sim.converged = false):(this.volts[2] > this.maxOut + 0.1 || this.volts[2] < this.minOut - 0.1) && (sim.converged = false);
  maxAdj = this.maxOut - midpoint;
  minAdj = this.minOut - midpoint;
  if (vd >= maxAdj / this.gain && (this.lastvd >= 0 || $getrand(app, 4) == 1)) {
    dx = $intern_33;
    x_0 = this.maxOut - $intern_33 * maxAdj / this.gain;
  }
   else if (vd <= minAdj / this.gain && (this.lastvd <= 0 || $getrand(app, 4) == 1)) {
    dx = $intern_33;
    x_0 = this.minOut - $intern_33 * minAdj / this.gain;
  }
   else {
    dx = this.gain;
    x_0 = midpoint;
  }
  $stampMatrix_1(this.voltSource_0, this.nodes[0], dx);
  $stampMatrix_1(this.voltSource_0, this.nodes[1], -dx);
  $stampMatrix_1(this.voltSource_0, this.nodes[2], 1);
  $stampRightSide_0(this.voltSource_0, x_0);
  this.lastvd = vd;
}
;
_.getConnection = function getConnection_15(n1, n2){
  return false;
}
;
_.getCurrentIntoNode = function getCurrentIntoNode_14(n){
  if (n == 2)
    return -this.current_1;
  return 0;
}
;
_.getDumpType = function getDumpType_46(){
  return 97;
}
;
_.getMatrixConnection = function getMatrixConnection_5(n1, n2){
  return true;
}
;
_.getPost = function getPost_11(n){
  return n == 0?this.in1p[0]:n == 1?this.in2p[0]:this.point2;
}
;
_.getPostCount = function getPostCount_27(){
  return 3;
}
;
_.getVoltageDiff = function getVoltageDiff_16(){
  return this.volts[2] - this.volts[1];
}
;
_.getVoltageSourceCount = function getVoltageSourceCount_21(){
  return 1;
}
;
_.hasGroundConnection = function hasGroundConnection_13(n1){
  return n1 == 2;
}
;
_.nonLinear_0 = function nonLinear_11(){
  return true;
}
;
_.setPoints = function setPoints_37(){
  var hs, tris, ww;
  $setPoints(this);
  ww = this.opwidth;
  ww > this.dn / 2 && (ww = round_int(this.dn / 2));
  $calcLeads(this, ww * 2);
  hs = this.opheight * this.dsign;
  (this.flags & 1) != 0 && (hs = -hs);
  this.in1p = $newPointArray(2);
  this.in2p = $newPointArray(2);
  this.textp = $newPointArray(2);
  $interpPoint2(this.point1, this.point2, this.in1p[0], this.in2p[0], 0, hs);
  $interpPoint2(this.lead1, this.lead2, this.in1p[1], this.in2p[1], 0, hs);
  $interpPoint2(this.lead1, this.lead2, this.textp[0], this.textp[1], 0.2, hs);
  tris = $newPointArray(2);
  $interpPoint2(this.lead1, this.lead2, tris[0], tris[1], 0, hs * 2);
  $createPolygon(tris[0], tris[1], this.lead2);
}
;
_.stamp = function stamp_32(){
  $stampMatrix_0(this.nodes[2], this.voltSource_0, 1);
}
;
_.validate = function validate_13(){
  return $validateRailNode(this, 2);
}
;
_.gain = 0;
_.gbw = 0;
_.lastvd = 0;
_.maxOut = 0;
_.minOut = 0;
_.opheight = 0;
_.opwidth = 0;
var Lcom_lushprojects_circuitjs1_client_OpAmpElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'OpAmpElm', 92);
function OutputElm(xa, ya, xb, yb, f, st){
  CircuitElm.call(this, xa, ya, xb, yb, f);
  try {
    __parseAndValidateInt($nextToken(st), 10);
  }
   catch ($e0) {
    $e0 = toJava($e0);
    if (!instanceOf($e0, 9))
      throw toJs($e0);
  }
}

defineClass(142, 4, $intern_9, OutputElm);
_.getDumpType = function getDumpType_47(){
  return 79;
}
;
_.getPostCount = function getPostCount_28(){
  return 1;
}
;
_.getVoltageDiff = function getVoltageDiff_17(){
  return this.volts[0];
}
;
_.setPoints = function setPoints_38(){
  $setPoints(this);
  this.lead1 = new Point;
}
;
var Lcom_lushprojects_circuitjs1_client_OutputElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'OutputElm', 142);
function $equals(this$static, other){
  var result, that;
  result = false;
  if (instanceOf(other, 11)) {
    that = castTo(other, 11);
    result = this$static.x_0 == that.x_0 && this$static.y_0 == that.y_0 && this$static.z_0 == that.z_0;
  }
  return result;
}

function $move(this$static, dx, dy){
  this$static.x_0 += dx;
  this$static.y_0 += dy;
}

function Point(){
  this.x_0 = 0;
  this.y_0 = 0;
}

function Point_0(i, j){
  this.x_0 = i;
  this.y_0 = j;
}

function Point_1(i, j, k){
  this.x_0 = i;
  this.y_0 = j;
  this.z_0 = k;
}

defineClass(11, 1, {11:1}, Point, Point_0, Point_1);
_.equals_0 = function equals_0(other){
  return $equals(this, other);
}
;
_.hashCode_0 = function hashCode_1(){
  return 41 * (41 * (41 + this.x_0) + this.y_0) + this.z_0;
}
;
_.toString_0 = function toString_4(){
  if (this.z_0 != 0)
    return 'Point(' + this.x_0 + ',' + this.y_0 + ',' + this.z_0 + ')';
  return 'Point(' + this.x_0 + ',' + this.y_0 + ')';
}
;
_.x_0 = 0;
_.y_0 = 0;
_.z_0 = 0;
var Lcom_lushprojects_circuitjs1_client_Point_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'Point', 11);
function PolarCapacitorElm(xa, ya, xb, yb, f, st){
  CapacitorElm.call(this, xa, ya, xb, yb, f, st);
  this.maxNegativeVoltage = $doubleValue(__parseAndValidateDouble($nextToken(st)));
}

defineClass(85, 50, {50:1, 4:1, 6:1, 85:1}, PolarCapacitorElm);
_.getDumpType = function getDumpType_48(){
  return 209;
}
;
_.setPoints = function setPoints_39(){
  var f, i, maxI, midI, q;
  $setPoints_2(this);
  f = (this.dn / 2 - 4) / this.dn;
  this.platePoints = $newPointArray(14);
  maxI = this.platePoints.length - 1;
  midI = maxI / 2;
  for (i = 0; i <= maxI; i++) {
    q = (i - midI) * 0.9 / midI;
    this.platePoints[i] = $interpPoint_0(this.plate2[0], this.plate2[1], i / maxI, 5 * (1 - $wnd.Math.sqrt(1 - q * q)));
  }
  this.plusPoint = $interpPoint_0(this.point1, this.point2, f - 8 / this.dn, -10 * this.dsign);
  this.y2 > this.y_0 && (this.plusPoint.y_0 += 4);
  this.y_0 > this.y2 && (this.plusPoint.y_0 += 3);
}
;
_.stepFinished = function stepFinished_9(){
  this.volts[0] - this.volts[1] < 0 && this.volts[0] - this.volts[1] < -this.maxNegativeVoltage && $stop(sim, 'capacitor exceeded max reverse voltage');
  this.voltdiff = this.volts[0] - this.volts[this.capNode2];
  $calculateCurrent(this);
}
;
_.maxNegativeVoltage = 0;
var Lcom_lushprojects_circuitjs1_client_PolarCapacitorElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'PolarCapacitorElm', 85);
function $addPoint(this$static, x_0, y_0){
  var newLength;
  if (this$static.npoints >= this$static.xpoints.length || this$static.npoints >= this$static.ypoints.length) {
    newLength = this$static.npoints * 2;
    newLength < 4?(newLength = 4):(newLength & newLength - 1) != 0 && (newLength = highestOneBit(newLength));
    this$static.xpoints = $expand(this$static.xpoints, newLength);
    this$static.ypoints = $expand(this$static.ypoints, newLength);
  }
  this$static.xpoints[this$static.npoints] = x_0;
  this$static.ypoints[this$static.npoints] = y_0;
  ++this$static.npoints;
}

function $expand(in_0, newlen){
  var i, out;
  out = initUnidimensionalArray(I_classLit, $intern_12, 5, newlen, 15, 1);
  for (i = 0; i < in_0.length; i++)
    out[i] = in_0[i];
  return out;
}

function Polygon(){
  this.xpoints = initUnidimensionalArray(I_classLit, $intern_12, 5, 4, 15, 1);
  this.ypoints = initUnidimensionalArray(I_classLit, $intern_12, 5, 4, 15, 1);
}

defineClass(74, 1, {74:1}, Polygon);
_.npoints = 0;
var Lcom_lushprojects_circuitjs1_client_Polygon_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'Polygon', 74);
function $setPoints_11(this$static){
  var clen, myLen, offset, soff;
  $setPoints(this$static);
  offset = 0;
  if (abs_0(this$static.dx) > abs_0(this$static.dy) != ((this$static.flags & 2) != 0)) {
    myLen = 2 * app.gridSize * signum(this$static.dx) * (($wnd.Math.abs(this$static.dx) + 2 * app.gridSize - 1) / (2 * app.gridSize) | 0);
    this$static.point2.x_0 = this$static.point1.x_0 + myLen;
    offset = this$static.dx < 0?this$static.dy:-this$static.dy;
    this$static.point2.y_0 = this$static.point1.y_0;
  }
   else {
    myLen = 2 * app.gridSize * signum(this$static.dy) * (($wnd.Math.abs(this$static.dy) + 2 * app.gridSize - 1) / (2 * app.gridSize) | 0);
    if (this$static.dy != 0) {
      this$static.point2.y_0 = this$static.point1.y_0 + myLen;
      offset = this$static.dy > 0?this$static.dx:-this$static.dx;
      this$static.point2.x_0 = this$static.point1.x_0;
    }
  }
  offset == 0 && (offset = (this$static.flags & 4) != 0?-app.gridSize:app.gridSize);
  this$static.dn = distance(this$static.point1, this$static.point2);
  $calcLeads(this$static, 32);
  soff = round_int((this$static.position - 0.5) * 32);
  this$static.post3 = $interpPoint_0(this$static.point1, this$static.point2, 0.5, offset);
  this$static.corner2 = $interpPoint_0(this$static.point1, this$static.point2, soff / this$static.dn + 0.5, offset);
  this$static.arrowPoint = $interpPoint_0(this$static.point1, this$static.point2, soff / this$static.dn + 0.5, 8 * (offset < 0?-1:offset == 0?0:1));
  $interpPoint(this$static.point1, this$static.point2, soff / this$static.dn + 0.5);
  this$static.arrow1 = new Point;
  this$static.arrow2 = new Point;
  clen = (offset < 0?-offset:offset) - 8;
  $interpPoint2(this$static.corner2, this$static.arrowPoint, this$static.arrow1, this$static.arrow2, (clen - 8) / clen, 8);
  new Point;
  new Point;
}

function PotElm(xa, ya, xb, yb, f, st){
  CircuitElm.call(this, xa, ya, xb, yb, f);
  this.maxResistance = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.position = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.sliderText = $nextToken(st);
  while ($hasMoreTokens(st))
    this.sliderText += ' ' + $nextToken(st);
}

defineClass(52, 4, {4:1, 6:1, 52:1}, PotElm);
_.calculateCurrent = function calculateCurrent_18(){
  this.current1 = this.resistance1 == 0?0:(this.volts[0] - this.volts[2]) / this.resistance1;
  this.current2 = this.resistance2 == 0?0:(this.volts[1] - this.volts[2]) / this.resistance2;
  this.current3 = -this.current1 - this.current2;
}
;
_.execute = function execute_7(){
  var ce, ce$iterator, pe;
  $setPoints_11(this);
  if (this.link_0 != 0) {
    for (ce$iterator = new ArrayList$1(app.elmList.arrayList); ce$iterator.i < ce$iterator.this$01.array.length;) {
      ce = castTo($next_0(ce$iterator), 4);
      if (instanceOf(ce, 52) && ce != this) {
        pe = castTo(ce, 52);
        pe.link_0 == this.link_0 && $setPoints_11(pe);
      }
    }
  }
}
;
_.getConnection = function getConnection_16(n1, n2){
  if (this.position == 0)
    return n1 == 0 && n2 == 2 || n1 == 2 && n2 == 0;
  if (this.position == 1)
    return n1 == 1 && n2 == 2 || n1 == 2 && n2 == 1;
  return true;
}
;
_.getCurrentIntoNode = function getCurrentIntoNode_15(n){
  if (n == 0)
    return -this.current1;
  if (n == 1)
    return -this.current2;
  return -this.current3;
}
;
_.getDumpType = function getDumpType_49(){
  return 174;
}
;
_.getPost = function getPost_12(n){
  return n == 0?this.point1:n == 1?this.point2:this.post3;
}
;
_.getPostCount = function getPostCount_29(){
  return 3;
}
;
_.getVoltageSourceCount = function getVoltageSourceCount_22(){
  return this.position == 0 || this.position == 1?1:0;
}
;
_.isWireEquivalent = function isWireEquivalent_7(){
  return this.position == 0 || this.position == 1;
}
;
_.reset_0 = function reset_22(){
  $reset(this);
}
;
_.setCurrent = function setCurrent_7(vs, c){
  if (this.position == 0) {
    this.current1 = c;
    this.current2 = 0;
  }
   else {
    this.current1 = 0;
    this.current2 = c;
  }
  this.current3 = -this.current1 - this.current2;
}
;
_.setPoints = function setPoints_40(){
  $setPoints_11(this);
}
;
_.setVoltageSource = function setVoltageSource_8(n, v){
  this.voltSource = v;
  this.position == 0?$setNodes(v, this.nodes[0], this.nodes[2]):$setNodes(v, this.nodes[1], this.nodes[2]);
}
;
_.stamp = function stamp_33(){
  this.resistance1 = this.maxResistance * this.position;
  this.resistance2 = this.maxResistance * (1 - this.position);
  this.resistance1 > 0 && $stampResistor(this.nodes[0], this.nodes[2], this.resistance1);
  this.resistance2 > 0 && $stampResistor(this.nodes[2], this.nodes[1], this.resistance2);
  (this.position == 0 || this.position == 1) && $stampVoltageSource_1(this.voltSource);
}
;
_.current1 = 0;
_.current2 = 0;
_.current3 = 0;
_.link_0 = 0;
_.maxResistance = 0;
_.position = 0;
_.resistance1 = 0;
_.resistance2 = 0;
var Lcom_lushprojects_circuitjs1_client_PotElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'PotElm', 52);
function ProbeElm(xa, ya, xb, yb, st){
  CircuitElm.call(this, xa, ya, xb, yb, 3);
  this.rmsV = 0;
  this.binaryLevel = 0;
  this.zerocount = 0;
  this.maxV = 0;
  this.minV = 0;
  this.increasingV = true;
  this.decreasingV = true;
  this.meter = 0;
  this.resistance = 0;
  try {
    this.meter = __parseAndValidateInt($nextToken(st), 10);
    __parseAndValidateInt($nextToken(st), 10);
    this.resistance = __parseAndValidateDouble($nextToken(st));
  }
   catch ($e0) {
    $e0 = toJava($e0);
    if (!instanceOf($e0, 9))
      throw toJs($e0);
  }
}

defineClass(60, 4, {4:1, 6:1, 60:1}, ProbeElm);
_.calculateCurrent = function calculateCurrent_19(){
  this.current_1 = this.resistance == 0?0:(this.volts[0] - this.volts[1]) / this.resistance;
}
;
_.getConnection = function getConnection_17(n1, n2){
  return this.resistance != 0;
}
;
_.getDumpType = function getDumpType_50(){
  return 112;
}
;
_.setPoints = function setPoints_41(){
  $setPoints(this);
  $interpPoint(this.point1, this.point2, 0.5);
}
;
_.stamp = function stamp_34(){
  this.resistance != 0 && $stampResistor(this.nodes[0], this.nodes[1], this.resistance);
}
;
_.stepFinished = function stepFinished_10(){
  var v;
  ++this.count;
  v = this.volts[0] - this.volts[1];
  this.total += v * v;
  v < 2.5?(this.binaryLevel = 0):(this.binaryLevel = 1);
  if (v > this.maxV && this.increasingV) {
    this.maxV = v;
    this.increasingV = true;
    this.decreasingV = false;
  }
  if (v < this.maxV && this.increasingV) {
    this.lastMaxV = this.maxV;
    sub_1(fromDouble_0(Date.now()), this.periodStart);
    this.periodStart = fromDouble_0(Date.now());
    sub_1(fromDouble_0(Date.now()), this.pulseStart);
    this.minV = v;
    this.increasingV = false;
    this.decreasingV = true;
    this.total = this.total / this.count;
    this.rmsV = $wnd.Math.sqrt(this.total);
    isNaN(this.rmsV) && (this.rmsV = 0);
    this.count = 0;
    this.total = 0;
  }
  if (v < this.minV && this.decreasingV) {
    this.minV = v;
    this.increasingV = false;
    this.decreasingV = true;
  }
  if (v > this.minV && this.decreasingV) {
    this.lastMinV = this.minV;
    this.pulseStart = fromDouble_0(Date.now());
    this.maxV = v;
    this.increasingV = true;
    this.decreasingV = false;
    this.total = this.total / this.count;
    this.rmsV = $wnd.Math.sqrt(this.total);
    isNaN(this.rmsV) && (this.rmsV = 0);
    this.count = 0;
    this.total = 0;
  }
  if (v == 0) {
    ++this.zerocount;
    if (this.zerocount > 5) {
      this.total = 0;
      this.rmsV = 0;
      this.maxV = 0;
      this.minV = 0;
    }
  }
   else {
    this.zerocount = 0;
  }
}
;
_.binaryLevel = 0;
_.count = 0;
_.decreasingV = false;
_.increasingV = false;
_.lastMaxV = 0;
_.lastMinV = 0;
_.maxV = 0;
_.meter = 0;
_.minV = 0;
_.periodStart = 0;
_.pulseStart = 0;
_.resistance = 0;
_.rmsV = 0;
_.total = 0;
_.zerocount = 0;
var Lcom_lushprojects_circuitjs1_client_ProbeElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'ProbeElm', 60);
function $setBounds(this$static, x_0, y_0, width_0, height){
  this$static.x_0 = x_0;
  this$static.y_0 = y_0;
  this$static.width_0 = width_0;
  this$static.height = height;
}

function Rectangle(){
  this.x_0 = 0;
  this.y_0 = 0;
  this.width_0 = 0;
  this.height = 0;
}

defineClass(97, 1, {97:1}, Rectangle);
_.equals_0 = function equals_1(obj){
  var r;
  if (instanceOf(obj, 97)) {
    r = castTo(obj, 97);
    return this.x_0 == r.x_0 && this.y_0 == r.y_0 && this.width_0 == r.width_0 && this.height == r.height;
  }
  return this === obj;
}
;
_.toString_0 = function toString_5(){
  return 'Rect(' + this.x_0 + ',' + this.y_0 + ',' + this.width_0 + ',' + this.height + ')';
}
;
_.height = 0;
_.width_0 = 0;
_.x_0 = 0;
_.y_0 = 0;
var Lcom_lushprojects_circuitjs1_client_Rectangle_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'Rectangle', 97);
function ResistorElm(xa, ya, xb, yb, f, st){
  CircuitElm.call(this, xa, ya, xb, yb, f);
  this.resistance = $doubleValue(__parseAndValidateDouble($nextToken(st)));
}

defineClass(84, 4, {4:1, 6:1, 84:1}, ResistorElm);
_.calculateCurrent = function calculateCurrent_20(){
  this.current_1 = (this.volts[0] - this.volts[1]) / this.resistance;
}
;
_.getDumpType = function getDumpType_51(){
  return 114;
}
;
_.setPoints = function setPoints_42(){
  $setPoints(this);
  $calcLeads(this, 32);
  new Point;
  new Point;
}
;
_.stamp = function stamp_35(){
  $stampResistor(this.nodes[0], this.nodes[1], this.resistance);
}
;
_.resistance = 0;
var Lcom_lushprojects_circuitjs1_client_ResistorElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'ResistorElm', 84);
function SCRElm(xa, ya, xb, yb, f, st){
  CircuitElm.call(this, xa, ya, xb, yb, f);
  this.gresistance = 50;
  this.holdingI = 0.0082;
  this.triggerI = $intern_21;
  try {
    this.lastvac = $doubleValue(__parseAndValidateDouble($nextToken(st)));
    this.lastvag = $doubleValue(__parseAndValidateDouble($nextToken(st)));
    this.volts[0] = 0;
    this.volts[1] = -this.lastvac;
    this.volts[2] = -this.lastvag;
    this.triggerI = $doubleValue(__parseAndValidateDouble($nextToken(st)));
    this.holdingI = $doubleValue(__parseAndValidateDouble($nextToken(st)));
    this.gresistance = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  }
   catch ($e0) {
    $e0 = toJava($e0);
    if (!instanceOf($e0, 9))
      throw toJs($e0);
  }
  this.diode = new Diode(sim);
  $setup(this.diode, getModelWithName('default'));
  this.aresistance = 1;
}

defineClass(72, 4, {4:1, 6:1, 72:1}, SCRElm);
_.calculateCurrent = function calculateCurrent_21(){
  this.ig = (this.volts[2] - this.volts[1]) / this.gresistance;
  this.ia = (this.volts[0] - this.volts[3]) / this.aresistance;
  this.ic = -this.ig - this.ia;
}
;
_.doStep = function doStep_26(){
  var iamult, icmult, vac, vag;
  vac = this.volts[0] - this.volts[1];
  vag = this.volts[0] - this.volts[2];
  ($wnd.Math.abs(vac - this.lastvac) > $intern_21 || $wnd.Math.abs(vag - this.lastvag) > $intern_21) && (sim.converged = false);
  this.lastvac = vac;
  this.lastvag = vag;
  $doStep_0(this.diode, this.volts[3] - this.volts[1]);
  icmult = 1 / this.triggerI;
  iamult = 1 / this.holdingI - icmult;
  this.aresistance = -icmult * this.ic + this.ia * iamult > 1?0.0105:$intern_29;
  $stampResistor(this.nodes[0], this.nodes[3], this.aresistance);
}
;
_.getCurrentIntoNode = function getCurrentIntoNode_16(n){
  if (n == 0)
    return -this.ia;
  if (n == 1)
    return -this.ic;
  return -this.ig;
}
;
_.getDumpType = function getDumpType_52(){
  return 177;
}
;
_.getInternalNodeCount = function getInternalNodeCount_6(){
  return 1;
}
;
_.getPost = function getPost_13(n){
  return n == 0?this.point1:n == 1?this.point2:this.gate[1];
}
;
_.getPostCount = function getPostCount_30(){
  return 3;
}
;
_.nonLinear_0 = function nonLinear_12(){
  return true;
}
;
_.reset_0 = function reset_23(){
  this.volts[0] = this.volts[1] = this.volts[2] = 0;
  this.diode.lastvoltdiff = 0;
  this.lastvag = this.lastvac = 0;
}
;
_.setPoints = function setPoints_43(){
  var gatelen, leadlen, pa;
  $setPoints(this);
  this.dir_0 = 0;
  if (abs_0(this.dx) > abs_0(this.dy)) {
    this.dir_0 = -sign(this.dx) * sign(this.dy);
    (this.flags & 1) != 0 && (this.dn = abs_0(this.dx));
    this.point2.y_0 = this.point1.y_0;
  }
   else {
    this.dir_0 = sign(this.dy) * sign(this.dx);
    (this.flags & 1) != 0 && (this.dn = abs_0(this.dy));
    this.point2.x_0 = this.point1.x_0;
  }
  this.dir_0 == 0 && (this.dir_0 = 1);
  $calcLeads(this, 16);
  this.cathode = $newPointArray(2);
  pa = $newPointArray(2);
  $interpPoint2(this.lead1, this.lead2, pa[0], pa[1], 0, 8);
  $interpPoint2(this.lead1, this.lead2, this.cathode[0], this.cathode[1], 1, 8);
  $createPolygon(pa[0], pa[1], this.lead2);
  this.gate = $newPointArray(2);
  leadlen = (this.dn - 16) / 2;
  gatelen = app.gridSize;
  gatelen = round_int(gatelen + leadlen % app.gridSize);
  if (leadlen < gatelen) {
    this.x2 = this.x_0;
    this.y2 = this.y_0;
    return;
  }
  $interpPoint_2(this.lead2, this.point2, this.gate[0], gatelen / leadlen, gatelen * this.dir_0);
  $interpPoint_2(this.lead2, this.point2, this.gate[1], gatelen / leadlen, app.gridSize * 2 * this.dir_0);
  this.gate[1].x_0 = $snapGrid(this.gate[1].x_0);
  this.gate[1].y_0 = $snapGrid(this.gate[1].y_0);
}
;
_.stamp = function stamp_36(){
  $stampResistor(this.nodes[2], this.nodes[1], this.gresistance);
  $stamp_0(this.diode, this.nodes[3], this.nodes[1]);
}
;
_.aresistance = 0;
_.dir_0 = 0;
_.gresistance = 0;
_.holdingI = 0;
_.ia = 0;
_.ic = 0;
_.ig = 0;
_.lastvac = 0;
_.lastvag = 0;
_.triggerI = 0;
var Lcom_lushprojects_circuitjs1_client_SCRElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'SCRElm', 72);
function SchmittElm(xa, ya, xb, yb, f, st){
  InvertingSchmittElm.call(this, xa, ya, xb, yb, f, st);
}

defineClass(167, 77, $intern_32, SchmittElm);
_.doStep = function doStep_27(){
  var maxStep, out;
  if (this.state) {
    if (this.volts[0] > this.upperTrigger) {
      this.state = false;
      out = this.logicOnLevel;
    }
     else {
      out = this.logicOffLevel;
    }
  }
   else {
    if (this.volts[0] < this.lowerTrigger) {
      this.state = true;
      out = this.logicOffLevel;
    }
     else {
      out = this.logicOnLevel;
    }
  }
  maxStep = this.slewRate * sim.timeStep_0 * $intern_31;
  out = $wnd.Math.max($wnd.Math.min(this.lastOutputVoltage + maxStep, out), this.lastOutputVoltage - maxStep);
  $updateVoltageSource(this.voltSource_0, out);
}
;
_.getCurrentIntoNode = function getCurrentIntoNode_17(n){
  if (n == 1)
    return this.current_1;
  return 0;
}
;
_.getDumpType = function getDumpType_53(){
  return 182;
}
;
_.setPoints = function setPoints_44(){
  var triPoints, ww;
  $setPoints_8(this);
  ww = 16;
  16 > this.dn / 2 && (ww = round_int(this.dn / 2));
  this.lead1 = $interpPoint(this.point1, this.point2, 0.5 - ww / this.dn);
  this.lead2 = $interpPoint(this.point1, this.point2, 0.5 + (ww - 3) / this.dn);
  triPoints = $newPointArray(3);
  $interpPoint2(this.lead1, this.lead2, triPoints[0], triPoints[1], 0, 16);
  triPoints[2] = $interpPoint(this.point1, this.point2, 0.5 + (ww - 5) / this.dn);
  $createPolygon_1(triPoints);
}
;
_.startIteration = function startIteration_11(){
  this.lastOutputVoltage = this.volts[1];
}
;
_.lastOutputVoltage = 0;
var Lcom_lushprojects_circuitjs1_client_SchmittElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'SchmittElm', 167);
function $analyzeCircuit(this$static){
  this$static.app.stopMessage = null;
  this$static.elmList = this$static.app.elmList;
  if (this$static.elmList.arrayList.array.length == 0) {
    new Vector;
    new Vector;
    return;
  }
  $detectBusWidths(this$static, this$static.elmList);
}

function $applySolvedRightSide(this$static, m){
  var j, res, vs;
  for (j = 0; j != m.size_0; j++) {
    res = m.rightSide[j];
    if (isNaN(res)) {
      this$static.converged = false;
      break;
    }
    j < m.nodeCount && (m.nodeVoltages[j] = res);
  }
  for (j = 0; j != m.voltageSourceList.arrayList.array.length; j++) {
    vs = castTo($get_2(m.voltageSourceList, j), 34);
    res = m.rightSide[vs.row - 1];
    isNaN(res) || vs.elm.setCurrent(vs, res);
  }
  $setNodeVoltages(m, m.nodeVoltages);
}

function $calcWireCurrents(this$static){
  var ce, cur, i, j, p, ws;
  for (i = 0; i != this$static.wireInfoList.arrayList.array.length; i++) {
    ws = castTo($get_2(this$static.wireInfoList, i), 36);
    cur = 0;
    if (ws.post == 0) {
      p = ws.wire.getPost(ws.bit);
      for (j = 0; j != ws.neighbors.arrayList.array.length; j++) {
        ce = castTo($get_2(ws.neighbors, j), 4);
        cur += ce.getCurrentIntoNode($getNodeAtPoint(ce, p));
      }
    }
     else {
      if (ws.endpoint1 != null && $startsWith(ws.endpoint1, 'label:')) {
        if (ws.labelNeighbors)
          for (j = 0; j != ws.labelNeighbors.arrayList.array.length; j++)
            cur += castTo($get_2(ws.labelNeighbors, j), 36).current_0;
      }
       else {
        p = ws.wire.getConnectedPost_0(ws.bit);
        for (j = 0; j != ws.neighbors.arrayList.array.length; j++) {
          ce = castTo($get_2(ws.neighbors, j), 4);
          cur += ce.getCurrentIntoNode($getNodeAtPoint(ce, p));
        }
      }
    }
    ws.post != 0 && (cur = -cur);
    ws.wire.setWireCurrent(ws.bit, cur);
    ws.current_0 = cur;
  }
}

function $calcWireInfo(this$static){
  var bits, ce, cn1, cnl, i, isReady0, isReady1, j, k, labelMap, labelNeighbors, list, moved, neighborBit, neighbors0, neighbors1, notReady, other, peers, pt, ptKey, wire, wk, ws;
  moved = 0;
  this$static.wireInfoResolved = new HashMap;
  labelMap = new HashMap;
  for (i = 0; i != this$static.wireInfoList.arrayList.array.length; i++) {
    ws = castTo($get_2(this$static.wireInfoList, i), 36);
    if (ws.endpoint1 != null && $startsWith(ws.endpoint1, 'label:')) {
      list = castTo($getStringValue(labelMap, ws.endpoint1), 16);
      if (!list) {
        list = new Vector;
        $putStringValue(labelMap, ws.endpoint1, list);
      }
      $add(list.arrayList, ws);
    }
  }
  for (i = 0; i != this$static.wireInfoList.arrayList.array.length; i++) {
    ws = castTo($get_2(this$static.wireInfoList, i), 36);
    wire = ws.wire;
    cn1 = $getNode(wire, ws.bit);
    if (!cn1) {
      ws.neighbors = new Vector;
      ws.labelNeighbors = new Vector;
      $setWireInfoResolved(this$static, wire, ws.bit);
      continue;
    }
    neighbors0 = new Vector;
    neighbors1 = new Vector;
    labelNeighbors = new Vector;
    isReady0 = true;
    isReady1 = !instanceOf(wire, 81);
    for (j = 0; j != cn1.links_0.arrayList.array.length; j++) {
      cnl = castTo($get_2(cn1.links_0, j), 44);
      ce = cnl.elm;
      if (ce == wire)
        continue;
      if (!$contains_0(this$static.wireInfoElmSet, ce))
        continue;
      if (cnl.num >= ce.getPostCount())
        continue;
      pt = ce.getPost(cnl.num);
      if (!pt)
        continue;
      ptKey = pt.x_0 + ',' + pt.y_0 + ',' + pt.z_0;
      neighborBit = cnl.num % ce.getBusWidth();
      notReady = ce.isRemovableWire() && (bits = castTo($get(this$static.wireInfoResolved, ce), 83) , !(!!bits && $contains_0(bits, valueOf(neighborBit))));
      if (ws.endpoint0 != null && $equals_0(ws.endpoint0, ptKey)) {
        $add(neighbors0.arrayList, ce);
        notReady && (isReady0 = false);
      }
       else if (ws.endpoint1 != null && !$startsWith(ws.endpoint1, 'label:') && $equals_0(ws.endpoint1, ptKey)) {
        $add(neighbors1.arrayList, ce);
        notReady && (isReady1 = false);
      }
    }
    if (ws.endpoint1 != null && $startsWith(ws.endpoint1, 'label:')) {
      peers = castTo($getStringValue(labelMap, ws.endpoint1), 16);
      if (peers) {
        for (j = 0; j != peers.arrayList.array.length; j++) {
          other = (checkArrayElementIndex(j, peers.arrayList.array.length) , castTo($get_0(peers.arrayList, j), 36));
          if (other == ws)
            continue;
          notReady = !$isWireInfoResolved(this$static, other.wire, other.bit);
          $add(labelNeighbors.arrayList, other);
          notReady && (isReady1 = false);
        }
      }
    }
    if (isReady0) {
      ws.neighbors = neighbors0;
      ws.post = 0;
      $setWireInfoResolved(this$static, wire, ws.bit);
      moved = 0;
    }
     else if (isReady1 && (ws.endpoint1 != null || !instanceOf(wire, 81))) {
      ws.neighbors = neighbors1;
      ws.labelNeighbors = labelNeighbors;
      ws.post = 1;
      $setWireInfoResolved(this$static, wire, ws.bit);
      moved = 0;
    }
     else {
      $add_2(this$static.wireInfoList, castTo($remove_0(this$static.wireInfoList, i--), 36));
      ++moved;
      if (moved > this$static.wireInfoList.arrayList.array.length * 2) {
        console_1('wire loop detected, ' + this$static.wireInfoList.arrayList.array.length + ' wires total, unresolved:');
        for (k = i; k < this$static.wireInfoList.arrayList.array.length; k++) {
          if (k < 0)
            continue;
          wk = castTo($get_2(this$static.wireInfoList, k), 36);
          console_1('  unresolved: ' + $getSimpleName(wk.wire.___clazz) + ' bit=' + wk.bit + ' ep0=' + wk.endpoint0 + ' ep1=' + wk.endpoint1 + ' resolved=' + $get(this$static.wireInfoResolved, wk.wire));
        }
        $stop(this$static, 'wire loop detected');
        return false;
      }
    }
  }
  return true;
}

function $calculateClosures(this$static){
  var ce, ci, ci0, closureCount, closureIndex, cn, cnl, i, j, k, kn, m, n, nodeStr, post1, stack_0, totalNodes;
  totalNodes = this$static.nodeList.arrayList.array.length;
  closureIndex = initUnidimensionalArray(I_classLit, $intern_12, 5, totalNodes, 15, 1);
  for (i = 1; i != totalNodes; i++)
    closureIndex[i] = -1;
  closureCount = 0;
  for (i = 1; i != totalNodes; i++) {
    if (closureIndex[i] >= 0)
      continue;
    stack_0 = new Vector;
    $add_2(stack_0, valueOf(i));
    closureIndex[i] = closureCount;
    while (stack_0.arrayList.array.length != 0) {
      n = castTo($remove_0(stack_0, stack_0.arrayList.array.length - 1), 17).value_0;
      cn = $getCircuitNode(this$static, n);
      for (j = 0; j != cn.links_0.arrayList.array.length; j++) {
        cnl = castTo($get_2(cn.links_0, j), 44);
        ce = cnl.elm;
        post1 = cnl.num;
        for (k = 0; k != ce.getPostCount() + ce.getInternalNodeCount(); k++) {
          if (k == post1)
            continue;
          if (!ce.getMatrixConnection(post1, k))
            continue;
          kn = ce.nodes[k].index_0;
          if (kn == 0)
            continue;
          if (closureIndex[kn] < 0) {
            closureIndex[kn] = closureCount;
            $add_2(stack_0, valueOf(kn));
          }
        }
      }
    }
    ++closureCount;
  }
  closureCount == 0 && (closureCount = 1);
  this$static.matrices = initUnidimensionalArray(Lcom_lushprojects_circuitjs1_client_CircuitMatrix_2_classLit, $intern_6, 110, closureCount, 0, 1);
  for (i = 0; i != closureCount; i++)
    this$static.matrices[i] = new CircuitMatrix;
  for (i = 1; i != totalNodes; i++) {
    ci0 = closureIndex[i];
    if (ci0 < 0)
      continue;
    cn = $getCircuitNode(this$static, i);
    m = this$static.matrices[ci0];
    ++m.nodeCount;
    cn.row = m.nodeCount;
    cn.matrix = m;
    $add_2(m.nodeList, cn);
  }
  ground.row = 0;
  ground.matrix = null;
  for (ci = 0; ci != closureCount; ci++) {
    nodeStr = '';
    for (i = 1; i != totalNodes; i++) {
      if (closureIndex[i] == ci) {
        nodeStr.length > 0 && (nodeStr += ', ');
        nodeStr += i;
      }
    }
  }
}

function $calculateWireClosureForList(this$static, list){
  var bw, ce, cn, cn2, entry, entry$iterator, i, j, nm, p0, p1;
  nm = new HashMap;
  this$static.wireInfoList = new Vector;
  this$static.wireInfoElmSet = new HashSet_0(list);
  for (i = 0; i != list.arrayList.array.length; i++) {
    ce = (checkArrayElementIndex(i, list.arrayList.array.length) , castTo($get_0(list.arrayList, i), 4));
    if (!ce.isRemovableWire())
      continue;
    ce.getWireSegments(this$static.wireInfoList);
    bw = ce.getBusWidth();
    for (j = 0; j < bw; j++) {
      p0 = ce.getPost(j);
      cn = castTo(getEntryValueOrNull($getEntry(nm.hashCodeMap, p0)), 35);
      p1 = ce.getConnectedPost_0(j);
      if (!p1) {
        if (!cn) {
          cn = new SimulationManager$NodeMapEntry;
          $put_0(nm.hashCodeMap, p0, cn);
        }
        continue;
      }
      cn2 = castTo(getEntryValueOrNull($getEntry(nm.hashCodeMap, p1)), 35);
      if (!!cn && !!cn2) {
        for (entry$iterator = new AbstractHashMap$EntrySetIterator((new AbstractHashMap$EntrySet(nm)).this$01); entry$iterator.hasNext;) {
          entry = $next(entry$iterator);
          maskUndefined(entry.getValue()) === maskUndefined(cn2) && entry.setValue(cn);
        }
      }
       else if (cn) {
        $put_0(nm.hashCodeMap, p1, cn);
      }
       else if (cn2) {
        $put_0(nm.hashCodeMap, p0, cn2);
      }
       else {
        cn = new SimulationManager$NodeMapEntry;
        $put_0(nm.hashCodeMap, p0, cn);
        $put_0(nm.hashCodeMap, p1, cn);
      }
    }
  }
  this$static.nodeMap = nm;
}

function $connectUnconnectedNodes(this$static){
  var i, n;
  for (i = 0; i != this$static.unconnectedNodes.arrayList.array.length; i++) {
    n = castTo($get_2(this$static.unconnectedNodes, i), 17).value_0;
    $stampResistor(ground, castTo($get_2(this$static.nodeList, n), 33), $intern_19);
  }
}

function $detectBusWidths(this$static, list){
  var bw, ce, changed, existing, i, i0, i1, j, key, labelWidthMap, ln, lw, propagated, pt, w, w1, w2, widthMap, wire;
  this$static.busMismatchList = new Vector;
  widthMap = new HashMap;
  for (i0 = 0; i0 < list.arrayList.array.length; i0++) {
    ce = (checkArrayElementIndex(i0, list.arrayList.array.length) , castTo($get_0(list.arrayList, i0), 4));
    if (ce.isRemovableWire())
      continue;
    for (j = 0; j < ce.getPostCount(); j++) {
      w = ce.getPostWidth(j);
      if (w > 1) {
        pt = ce.getPost(j);
        key = new Point_0(pt.x_0, pt.y_0);
        existing = castTo(getEntryValueOrNull($getEntry(widthMap.hashCodeMap, key)), 17);
        !!existing && existing.value_0 != w && $add_2(this$static.busMismatchList, key);
        (!existing || w > existing.value_0) && $put(widthMap, key, valueOf(w));
      }
    }
  }
  labelWidthMap = new HashMap;
  changed = true;
  while (changed) {
    changed = false;
    for (i1 = 0; i1 < list.arrayList.array.length; i1++) {
      ce = (checkArrayElementIndex(i1, list.arrayList.array.length) , castTo($get_0(list.arrayList, i1), 4));
      if (instanceOf(ce, 99)) {
        wire = castTo(ce, 99);
        w1 = castTo($get(widthMap, wire.point1), 17);
        w2 = castTo($get(widthMap, wire.point2), 17);
        w = 1;
        !!w1 && (w = w1.value_0);
        !!w2 && w2.value_0 > w && (w = w2.value_0);
        if (w != wire.busWidth) {
          wire.busWidth = w;
          wire.currents = w > 1?initUnidimensionalArray(D_classLit, $intern_7, 5, w, 15, 1):null;
          $allocNodes(wire);
          changed = true;
        }
        if (w > 1) {
          if (!w1 || w1.value_0 < w) {
            $put(widthMap, wire.point1, valueOf(w));
            changed = true;
          }
          if (!w2 || w2.value_0 < w) {
            $put(widthMap, wire.point2, valueOf(w));
            changed = true;
          }
        }
      }
       else if (instanceOf(ce, 56)) {
        ln = castTo(ce, 56);
        w = castTo($get(widthMap, ln.point1), 17);
        lw = castTo($getStringValue(labelWidthMap, ln.text_0), 17);
        bw = 1;
        !!w && (bw = w.value_0);
        !!lw && lw.value_0 > bw && (bw = lw.value_0);
        if (bw != ln.busWidth) {
          ln.busWidth = bw;
          ln.currents = bw > 1?initUnidimensionalArray(D_classLit, $intern_7, 5, bw, 15, 1):null;
          $allocNodes(ln);
          changed = true;
        }
        if (bw > 1) {
          if (!w || w.value_0 < bw) {
            $put(widthMap, ln.point1, valueOf(bw));
            changed = true;
          }
          if (!lw || lw.value_0 < bw) {
            $putStringValue(labelWidthMap, ln.text_0, valueOf(bw));
            changed = true;
          }
        }
      }
    }
  }
  for (i = 0; i < list.arrayList.array.length; i++) {
    ce = (checkArrayElementIndex(i, list.arrayList.array.length) , castTo($get_0(list.arrayList, i), 4));
    if (ce.isRemovableWire())
      continue;
    for (j = 0; j < ce.getPostCount(); j++) {
      w = ce.getPostWidth(j);
      if (w > 1) {
        pt = ce.getPost(j);
        key = new Point_0(pt.x_0, pt.y_0);
        propagated = castTo(getEntryValueOrNull($getEntry(widthMap.hashCodeMap, key)), 17);
        !!propagated && propagated.value_0 != w && $add_2(this$static.busMismatchList, key);
      }
    }
  }
}

function $findUnconnectedNodes(this$static){
  var ce, closure, cn, cnl, found, hasGround, i, j, k, kn, n, post1, qHead, queue, s, scanFrom, totalNodes;
  totalNodes = this$static.nodeList.arrayList.array.length;
  closure = initUnidimensionalArray(Z_classLit, $intern_12, 5, totalNodes, 16, 1);
  this$static.unconnectedNodes = new Vector;
  this$static.nodesWithGroundConnection = new Vector;
  closure[0] = true;
  for (i = 0; i != this$static.elmList.arrayList.array.length; i++) {
    ce = $getElm(this$static, i);
    hasGround = false;
    for (j = 0; j < ce.getPostCount(); j++) {
      if (ce.hasGroundConnection(j)) {
        hasGround = true;
        closure[ce.nodes[j].index_0] = true;
      }
    }
    hasGround && $add_2(this$static.nodesWithGroundConnection, ce);
  }
  queue = new Vector;
  for (i = 0; i < totalNodes; i++)
    closure[i] && $add_2(queue, valueOf(i));
  qHead = 0;
  scanFrom = 1;
  for (;;) {
    if (qHead < queue.arrayList.array.length) {
      n = castTo($get_2(queue, qHead++), 17).value_0;
      cn = $getCircuitNode(this$static, n);
      for (j = 0; j != cn.links_0.arrayList.array.length; j++) {
        cnl = castTo($get_2(cn.links_0, j), 44);
        ce = cnl.elm;
        post1 = cnl.num;
        for (k = 0; k != ce.getPostCount(); k++) {
          if (k == post1)
            continue;
          kn = ce.nodes[k].index_0;
          if (!closure[kn] && ce.getConnection(post1, k)) {
            closure[kn] = true;
            $add_2(queue, valueOf(kn));
          }
        }
      }
    }
     else {
      found = false;
      for (; scanFrom < totalNodes; scanFrom++) {
        if (!closure[scanFrom] && !$getCircuitNode(this$static, scanFrom).internal) {
          $add_2(this$static.unconnectedNodes, valueOf(scanFrom));
          closure[scanFrom] = true;
          $add_2(queue, valueOf(scanFrom++));
          found = true;
          break;
        }
      }
      if (!found)
        break;
    }
  }
  if (this$static.unconnectedNodes.arrayList.array.length != 0) {
    s = 'unconnected nodes:';
    for (i = 0; i != this$static.unconnectedNodes.arrayList.array.length; i++)
      s += ' ' + $get_2(this$static.unconnectedNodes, i);
    console.log(s);
  }
}

function $getCircuitNode(this$static, n){
  if (n >= this$static.nodeList.arrayList.array.length)
    return null;
  return castTo($elementAt(this$static.nodeList, n), 33);
}

function $getElm(this$static, n){
  if (n >= this$static.elmList.arrayList.array.length)
    return null;
  return castTo($elementAt(this$static.elmList, n), 4);
}

function $isWireInfoResolved(this$static, ce, bit){
  var bits;
  bits = castTo($get(this$static.wireInfoResolved, ce), 83);
  return !!bits && $contains_0(bits, valueOf(bit));
}

function $makeNodeList(this$static){
  var ce, cln, cn, cnl, i, inodes, ivs, j, posts, pt, vscount;
  vscount = 0;
  for (i = 0; i != this$static.elmList.arrayList.array.length; i++)
    $getElm(this$static, i);
  for (i = 0; i != this$static.elmList.arrayList.array.length; i++) {
    ce = $getElm(this$static, i);
    inodes = ce.getInternalNodeCount();
    ivs = ce.getVoltageSourceCount();
    posts = ce.getPostCount();
    for (j = 0; j != posts; j++) {
      pt = ce.getPost(j);
      cln = castTo($get(this$static.nodeMap, pt), 35);
      if (!cln || !cln.node) {
        cn = new CircuitNode;
        cn.index_0 = this$static.nodeList.arrayList.array.length;
        cnl = new CircuitNodeLink;
        cnl.num = j;
        cnl.elm = ce;
        $addElement(cn.links_0, cnl);
        ce.setNode(j, cn);
        cln?(cln.node = cn):$put(this$static.nodeMap, pt, new SimulationManager$NodeMapEntry_0(cn));
        $addElement(this$static.nodeList, cn);
      }
       else {
        cn = cln.node;
        cnl = new CircuitNodeLink;
        cnl.num = j;
        cnl.elm = ce;
        $addElement(cn.links_0, cnl);
        ce.setNode(j, cn);
        cn == ground && ce.setNodeVoltage(j, 0);
      }
    }
    for (j = 0; j != inodes; j++) {
      cn = new CircuitNode;
      cn.index_0 = this$static.nodeList.arrayList.array.length;
      cn.internal = true;
      cnl = new CircuitNodeLink;
      cnl.num = j + posts;
      cnl.elm = ce;
      $addElement(cn.links_0, cnl);
      ce.setNode(cnl.num, cn);
      $addElement(this$static.nodeList, cn);
    }
    vscount += ivs;
  }
  this$static.voltageSources = initUnidimensionalArray(Lcom_lushprojects_circuitjs1_client_VoltageSource_2_classLit, $intern_6, 34, vscount, 0, 1);
}

function $preStampAndStampCircuit(this$static){
  var i;
  for (i = 0; i != 10; i++)
    if ($preStampCircuit(this$static) || this$static.app.stopMessage != null)
      break;
  if (this$static.app.stopMessage != null)
    return;
  if (i == 10) {
    $stop(this$static, 'failed to stamp circuit');
    return;
  }
  $stampCircuit(this$static);
}

function $preStampCircuit(this$static){
  var ce, elm$iterator, gotVoltageSource, i, ivs, j, m, mi, vs, vsPerMatrix, vscount;
  this$static.nodeList = new Vector;
  this$static.elmList = this$static.app.elmList;
  labelList = new HashMap;
  firstGround = null;
  $calculateWireClosureForList(this$static, this$static.elmList);
  $setGroundNode(this$static, false);
  $makeNodeList(this$static);
  if (!$calcWireInfo(this$static))
    return false;
  this$static.nodeMap = null;
  this$static.elmList = new Vector_0(this$static.app.elmList);
  for (elm$iterator = new ArrayList$1(this$static.elmList.arrayList); elm$iterator.i < elm$iterator.this$01.array.length;) {
    castTo($next_0(elm$iterator), 4);
  }
  vscount = 0;
  this$static.circuitNonLinear = false;
  for (i = 0; i != this$static.elmList.arrayList.array.length; i++) {
    ce = $getElm(this$static, i);
    ce.nonLinear_0() && (this$static.circuitNonLinear = true);
    ivs = ce.getVoltageSourceCount();
    for (j = 0; j != ivs; j++) {
      vs = new VoltageSource;
      vs.elm = ce;
      this$static.voltageSources[vscount] = vs;
      ce.setVoltageSource(j, vs);
      ++vscount;
    }
  }
  this$static.voltageSourceCount = vscount;
  gotVoltageSource = false;
  for (i = 0; i != this$static.elmList.arrayList.array.length; i++) {
    ce = $getElm(this$static, i);
    if (instanceOf(ce, 20)) {
      if (gotVoltageSource)
      ;
      else 
        gotVoltageSource = true;
    }
  }
  $findUnconnectedNodes(this$static);
  $calculateClosures(this$static);
  if (!$validateCircuit(this$static))
    return false;
  vsPerMatrix = initUnidimensionalArray(I_classLit, $intern_12, 5, this$static.matrices.length, 15, 1);
  for (i = 0; i != this$static.voltageSourceCount; i++) {
    vs = this$static.voltageSources[i];
    !!vs.n1 && vs.n1 != ground && !!vs.n1.matrix?(vs.matrix = vs.n1.matrix):!!vs.n2 && vs.n2 != ground && !!vs.n2.matrix?(vs.matrix = vs.n2.matrix):(vs.matrix = $getNode(vs.elm, vs.elm.getPostCount() - 1).matrix);
    !vs.matrix && console_0('null matrix! ' + vs.elm + ' n1=' + (!vs.n1?'null':vs.n1.index_0 + ' m=' + vs.n1.matrix) + ' n2=' + (!vs.n2?'null':vs.n2.index_0 + ' m=' + vs.n2.matrix) + ' fallback=' + $getNode(vs.elm, vs.elm.getPostCount() - 1).index_0);
  }
  for (i = 0; i != this$static.voltageSourceCount; i++) {
    vs = this$static.voltageSources[i];
    m = vs.matrix;
    mi = 0;
    for (j = 0; j != this$static.matrices.length; j++)
      if (this$static.matrices[j] == m) {
        mi = j;
        break;
      }
    ++vsPerMatrix[mi];
    vs.row = m.nodeCount + vsPerMatrix[mi];
    $add_2(m.voltageSourceList, vs);
  }
  for (i = 0; i != this$static.matrices.length; i++) {
    this$static.matrices[i].size_0 = this$static.matrices[i].nodeCount + vsPerMatrix[i];
  }
  this$static.nodesWithGroundConnection = null;
  this$static.timeStep_0 = this$static.maxTimeStep;
  return true;
}

function $resetTime(this$static){
  this$static.t = this$static.timeStepAccum = 0;
  this$static.timeStepCount = 0;
}

function $runCircuit(this$static, didAnalyze, stepLimit){
  var bounded, completedSteps, debugprint, frameTimeLimit, goodIterations, i, iter, j, lit, m, mi, mi0, mi1, printit, steprate, subiter, subiterCount, timeStepCountAtFrameStart, tm, x_0;
  if (this$static.matrices == null || this$static.elmList.arrayList.array.length == 0) {
    this$static.matrices = null;
    return;
  }
  debugprint = this$static.app.dumpMatrix;
  this$static.app.dumpMatrix = false;
  bounded = stepLimit > 0;
  completedSteps = 0;
  steprate = bounded?0:fromDouble_0(160 * $getIterCount());
  tm = fromDouble_0(Date.now());
  lit = this$static.lastIterTime;
  if (!bounded && compare_0(lit, 0) == 0) {
    this$static.lastIterTime = tm;
    return;
  }
  if (!bounded && gte(1000, mul_0(steprate, sub_1(tm, this$static.lastIterTime))) && !didAnalyze)
    return;
  timeStepCountAtFrameStart = this$static.timeStepCount;
  goodIterations = 100;
  frameTimeLimit = round_int(1000 / this$static.app.minFrameRate);
  for (iter = 1;; iter++) {
    if (goodIterations >= 3 && this$static.timeStep_0 < this$static.maxTimeStep) {
      this$static.timeStep_0 = $wnd.Math.min(this$static.timeStep_0 * 2, this$static.maxTimeStep);
      console_1('timestep up = ' + this$static.timeStep_0 + ' at ' + this$static.t);
      $stampCircuit(this$static);
      goodIterations = 0;
    }
    for (i = 0; i != this$static.elmArr.length; i++)
      this$static.elmArr[i].startIteration();
    subiterCount = this$static.adjustTimeStep && this$static.timeStep_0 / 2 > this$static.minTimeStep?100:5000;
    for (subiter = 0; subiter != subiterCount; subiter++) {
      this$static.converged = true;
      this$static.subIterations = subiter;
      for (mi0 = 0; mi0 != this$static.matrices.length; mi0++) {
        m = this$static.matrices[mi0];
        for (i = 0; i != m.size_0; i++)
          m.rightSide[i] = m.origRightSide[i];
        if (m.nonLinear) {
          for (i = 0; i != m.size_0; i++)
            for (j = 0; j != m.size_0; j++)
              m.matrix[i][j] = m.origMatrix[i][j];
        }
      }
      for (i = 0; i != this$static.elmArr.length; i++)
        this$static.elmArr[i].doStep();
      if (this$static.app.stopMessage != null)
        return;
      printit = debugprint;
      debugprint = false;
      for (mi1 = 0; mi1 != this$static.matrices.length; mi1++) {
        m = this$static.matrices[mi1];
        if (m.size_0 < 8) {
          for (j = 0; j != m.size_0; j++) {
            for (i = 0; i != m.size_0; i++) {
              x_0 = m.matrix[i][j];
              if (isNaN(x_0) || !isNaN(x_0) && !isFinite(x_0)) {
                $stop(this$static, 'nan/infinite matrix!');
                console.log('matrix ' + mi1 + ' [' + i + '][' + j + '] is ' + x_0);
                return;
              }
            }
          }
        }
        if (printit) {
          console.log('matrix ' + mi1 + ':');
          for (j = 0; j != m.size_0; j++) {
            x_0 = '';
            for (i = 0; i != m.size_0; i++)
              x_0 += m.matrix[j][i] + ',';
            x_0 += '\n';
            console.log(x_0);
          }
        }
        if (m.nonLinear) {
          if (this$static.converged && subiter > 0)
            continue;
          if (!lu_factor(m.matrix, m.size_0, m.permute, m)) {
            $stop(this$static, 'Singular matrix!');
            return;
          }
        }
        lu_solve(m.matrix, m.size_0, m.permute, m.rightSide, m);
        $applySolvedRightSide(this$static, m);
      }
      printit && (console.log('done') , undefined);
      if (!this$static.circuitNonLinear)
        break;
      if (this$static.converged && subiter > 0)
        break;
    }
    if (subiter == subiterCount) {
      goodIterations = 0;
      if (this$static.adjustTimeStep) {
        this$static.timeStep_0 /= 2;
        console_1('timestep down to ' + this$static.timeStep_0 + ' at ' + this$static.t);
      }
      if (this$static.timeStep_0 < this$static.minTimeStep || !this$static.adjustTimeStep) {
        console.log('convergence failed after ' + subiter + ' iterations');
        $stop(this$static, 'Convergence failed!');
        break;
      }
      for (mi0 = 0; mi0 != this$static.matrices.length; mi0++)
        $setNodeVoltages(this$static.matrices[mi0], this$static.matrices[mi0].lastNodeVoltages);
      $stampCircuit(this$static);
      continue;
    }
    (subiter > 5 || this$static.timeStep_0 < this$static.maxTimeStep) && console_1('converged after ' + subiter + ' iterations, timeStep = ' + this$static.timeStep_0);
    subiter < 3?++goodIterations:(goodIterations = 0);
    this$static.t += this$static.timeStep_0;
    this$static.timeStepAccum += this$static.timeStep_0;
    if (this$static.timeStepAccum >= this$static.maxTimeStep) {
      this$static.timeStepAccum -= this$static.maxTimeStep;
      ++this$static.timeStepCount;
    }
    for (i = 0; i != this$static.elmArr.length; i++) {
      this$static.elmArr[i].stepFinished();
      if (this$static.app.stopMessage != null)
        return;
    }
    $calcWireCurrents(this$static);
    for (mi = 0; mi != this$static.matrices.length; mi++) {
      m = this$static.matrices[mi];
      for (i = 0; i != m.nodeCount; i++)
        m.lastNodeVoltages[i] = m.nodeVoltages[i];
    }
    if (bounded) {
      if (++completedSteps >= stepLimit)
        break;
      continue;
    }
    tm = fromDouble_0(Date.now());
    lit = tm;
    if (gte((this$static.timeStepCount - timeStepCountAtFrameStart) * 1000, mul_0(steprate, sub_1(tm, this$static.lastIterTime))) || gt(sub_1(tm, null.$_nullField), frameTimeLimit))
      break;
    if (!this$static.app.simRunning)
      break;
  }
  this$static.lastIterTime = lit;
}

function $setGroundNode(this$static, subcircuit){
  var ce, cln, cn, gotGround, gotRail, i, nme, pt, volt;
  gotGround = false;
  gotRail = false;
  volt = null;
  cn = new CircuitNode;
  cn.index_0 = 0;
  $addElement(this$static.nodeList, cn);
  ground = cn;
  for (i = 0; i != this$static.elmList.arrayList.array.length; i++) {
    ce = $getElm(this$static, i);
    if (instanceOf(ce, 81)) {
      gotGround = true;
      nme = castTo($get(this$static.nodeMap, ce.getPost(0)), 35);
      nme.node = ground;
      break;
    }
    instanceOf(ce, 38) && (gotRail = true);
    !volt && instanceOf(ce, 20) && (volt = ce);
  }
  if (!subcircuit && !gotGround && !!volt && !gotRail) {
    pt = volt.getPost(0);
    cln = castTo($get(this$static.nodeMap, pt), 35);
    cln?(cln.node = ground):$put(this$static.nodeMap, pt, new SimulationManager$NodeMapEntry_0(ground));
  }
}

function $setNodeVoltages(m, nv){
  var cn, cnl, j, k, res;
  for (j = 0; j != m.nodeList.arrayList.array.length; j++) {
    cn = castTo($get_2(m.nodeList, j), 33);
    res = nv[cn.row - 1];
    for (k = 0; k != cn.links_0.arrayList.array.length; k++) {
      cnl = castTo($elementAt(cn.links_0, k), 44);
      cnl.elm.setNodeVoltage(cnl.num, res);
    }
  }
}

function $setWireInfoResolved(this$static, ce, bit){
  var bits;
  bits = castTo($get(this$static.wireInfoResolved, ce), 83);
  if (!bits) {
    bits = new HashSet;
    $put(this$static.wireInfoResolved, ce, bits);
  }
  $add_0(bits, valueOf(bit));
}

function $stampCircuit(this$static){
  var ce, i, j, m, maxMatrixSize, mi, mi0, sz;
  for (i = 0; i != this$static.matrices.length; i++) {
    m = this$static.matrices[i];
    sz = m.size_0;
    m.matrix = initMultidimensionalArray(D_classLit, [$intern_6, $intern_7], [8, 5], 15, [sz, sz], 2);
    m.rightSide = initUnidimensionalArray(D_classLit, $intern_7, 5, sz, 15, 1);
    m.origMatrix = initMultidimensionalArray(D_classLit, [$intern_6, $intern_7], [8, 5], 15, [sz, sz], 2);
    m.origRightSide = initUnidimensionalArray(D_classLit, $intern_7, 5, sz, 15, 1);
    m.permute = initUnidimensionalArray(I_classLit, $intern_12, 5, sz, 15, 1);
    m.nodeVoltages = initUnidimensionalArray(D_classLit, $intern_7, 5, m.nodeCount, 15, 1);
    (m.lastNodeVoltages == null || m.lastNodeVoltages.length != m.nodeCount) && (m.lastNodeVoltages = initUnidimensionalArray(D_classLit, $intern_7, 5, m.nodeCount, 15, 1));
    m.nonLinear = false;
  }
  if (this$static.circuitNonLinear) {
    for (i = 0; i != this$static.matrices.length; i++)
      this$static.matrices[i].nonLinear = true;
  }
  $connectUnconnectedNodes(this$static);
  for (i = 0; i != this$static.elmList.arrayList.array.length; i++) {
    ce = $getElm(this$static, i);
    ce.stamp();
  }
  if (this$static.matrices == null)
    return;
  maxMatrixSize = 0;
  for (mi0 = 0; mi0 != this$static.matrices.length; mi0++) {
    m = this$static.matrices[mi0];
    sz = m.size_0;
    sz > maxMatrixSize && (maxMatrixSize = sz);
    for (i = 0; i != sz; i++)
      m.origRightSide[i] = m.rightSide[i];
    for (i = 0; i != sz; i++)
      for (j = 0; j != sz; j++)
        m.origMatrix[i][j] = m.matrix[i][j];
  }
  this$static.usingSparse = maxMatrixSize >= 150;
  for (mi = 0; mi != this$static.matrices.length; mi++) {
    m = this$static.matrices[mi];
    if (!m.nonLinear) {
      if (!lu_factor(m.matrix, m.size_0, m.permute, m)) {
        $stop(this$static, 'Singular matrix!');
        return;
      }
    }
  }
  this$static.elmArr = initUnidimensionalArray(Lcom_lushprojects_circuitjs1_client_CircuitElm_2_classLit, $intern_6, 4, this$static.elmList.arrayList.array.length, 0, 1);
  for (i = 0; i != this$static.elmList.arrayList.array.length; i++) {
    this$static.elmArr[i] = castTo($get_2(this$static.elmList, i), 4);
  }
  for (i = 0; i != this$static.elmList.arrayList.array.length; i++)
  ;
}

function $stampConductance(n1, n2, r0){
  $stampMatrix(n1, n1, r0);
  $stampMatrix(n2, n2, r0);
  $stampMatrix(n1, n2, -r0);
  $stampMatrix(n2, n1, -r0);
}

function $stampCurrentSource(n1, n2, i){
  n1.row > 0 && (n1.matrix.rightSide[n1.row - 1] += -i);
  n2.row > 0 && (n2.matrix.rightSide[n2.row - 1] += i);
}

function $stampMatrix(i, j, x_0){
  var m;
  !isNaN(x_0) && !isFinite(x_0) && debugger_0();
  if (i.row > 0 && j.row > 0) {
    i.matrix != j.matrix && console_1('stampMatrix cross-matrix! node ' + i.index_0 + ' (matrix row ' + i.row + ') vs node ' + j.index_0 + ' (matrix row ' + j.row + ')');
    m = i != ground?i.matrix:j.matrix;
    m.matrix[i.row - 1][j.row - 1] += x_0;
  }
}

function $stampMatrix_0(i, j, x_0){
  !isNaN(x_0) && !isFinite(x_0) && debugger_0();
  if (i.row > 0) {
    i.matrix != j.matrix && console_1('stampMatrix cross-matrix! node ' + i.index_0 + ' (row ' + i.row + ') vs vs row ' + j.row);
    j.matrix.matrix[i.row - 1][j.row - 1] += x_0;
  }
}

function $stampMatrix_1(i, j, x_0){
  !isNaN(x_0) && !isFinite(x_0) && debugger_0();
  if (j.row > 0) {
    i.matrix != j.matrix && console_1('stampMatrix cross-matrix! vs row ' + i.row + ' vs node ' + j.index_0 + ' (row ' + j.row + ')');
    i.matrix.matrix[i.row - 1][j.row - 1] += x_0;
  }
}

function $stampResistor(n1, n2, r){
  var a, r0;
  r0 = 1 / r;
  if (isNaN(r0) || !isNaN(r0) && !isFinite(r0)) {
    a = 0;
    a = a / 0 | 0;
  }
  $stampMatrix(n1, n1, r0);
  $stampMatrix(n2, n2, r0);
  $stampMatrix(n1, n2, -r0);
  $stampMatrix(n2, n1, -r0);
}

function $stampRightSide(n, x_0){
  n.row > 0 && (n.matrix.rightSide[n.row - 1] += x_0);
}

function $stampRightSide_0(vs, x_0){
  vs.matrix.rightSide[vs.row - 1] += x_0;
}

function $stampVCCurrentSource(cn1, cn2, vn1, vn2, g){
  $stampMatrix(cn1, vn1, g);
  $stampMatrix(cn2, vn2, g);
  $stampMatrix(cn1, vn2, -g);
  $stampMatrix(cn2, vn1, -g);
}

function $stampVoltageSource(n1, n2, vs){
  $stampMatrix_1(vs, n1, -1);
  $stampMatrix_1(vs, n2, 1);
  $stampMatrix_0(n1, vs, 1);
  $stampMatrix_0(n2, vs, -1);
}

function $stampVoltageSource_0(n1, n2, vs, v){
  $stampMatrix_1(vs, n1, -1);
  $stampMatrix_1(vs, n2, 1);
  vs.matrix.rightSide[vs.row - 1] += v;
  $stampMatrix_0(n1, vs, 1);
  $stampMatrix_0(n2, vs, -1);
}

function $stampVoltageSource_1(vs){
  $stampVoltageSource_0(vs.n1, vs.n2, vs, 0);
}

function $stepCircuit(this$static, count){
  if (count < 1 || count > 10000)
    throw toJs(new IllegalArgumentException('Step count must be between 1 and 10000'));
  $runCircuit(this$static, false, count);
}

function $stop(this$static, s){
  $setStopElm(this$static.app, LS(s));
  this$static.matrices = null;
  this$static.app.simRunning = false;
}

function $updateVoltageSource(vs, v){
  vs.matrix.rightSide[vs.row - 1] += v;
}

function $validateCircuit(this$static){
  var ce, i;
  for (i = 0; i != this$static.elmList.arrayList.array.length; i++) {
    ce = $getElm(this$static, i);
    if (!ce.validate())
      return false;
  }
  return true;
}

function SimulationManager(app_){
  theSim = this;
  this.app = app_;
}

function console_1(text_0){
  console.log(text_0);
}

function debugger_0(){
  debugger;
}

function invertMatrix(a, n){
  var b, i, inva, ipvt, j;
  ipvt = initUnidimensionalArray(I_classLit, $intern_12, 5, n, 15, 1);
  lu_factor_dense(a, n, ipvt);
  b = initUnidimensionalArray(D_classLit, $intern_7, 5, n, 15, 1);
  inva = initMultidimensionalArray(D_classLit, [$intern_6, $intern_7], [8, 5], 15, [n, n], 2);
  for (i = 0; i != n; i++) {
    for (j = 0; j != n; j++)
      b[j] = 0;
    b[i] = 1;
    lu_solve_dense(a, n, ipvt, b);
    for (j = 0; j != n; j++)
      inva[j][i] = b[j];
  }
  for (i = 0; i != n; i++)
    for (j = 0; j != n; j++)
      a[i][j] = inva[i][j];
}

function lu_factor(a, n, ipvt, cm){
  var csc, sm;
  sm = theSim;
  if (!!sm && sm.usingSparse) {
    csc = convert(a, ($clinit_DMatrixSparseCSC() , EPS));
    !cm.sparseLU && (cm.sparseLU = new SparseLU);
    return $setA(cm.sparseLU, csc);
  }
  return lu_factor_dense(a, n, ipvt);
}

function lu_factor_dense(a, n, ipvt){
  var i, j, k, largest, largestRow, mult, q, row_all_zeros, x_0;
  for (i = 0; i != n; i++) {
    row_all_zeros = true;
    for (j = 0; j != n; j++) {
      if (a[i][j] != 0) {
        row_all_zeros = false;
        break;
      }
    }
    if (row_all_zeros)
      return false;
  }
  for (j = 0; j != n; j++) {
    for (i = 0; i != j; i++) {
      q = a[i][j];
      for (k = 0; k != i; k++)
        q -= a[i][k] * a[k][j];
      a[i][j] = q;
    }
    largest = 0;
    largestRow = -1;
    for (i = j; i != n; i++) {
      q = a[i][j];
      for (k = 0; k != j; k++)
        q -= a[i][k] * a[k][j];
      a[i][j] = q;
      x_0 = $wnd.Math.abs(q);
      if (x_0 >= largest) {
        largest = x_0;
        largestRow = i;
      }
    }
    if (j != largestRow) {
      if (largestRow == -1) {
        console.log('largestRow == -1');
        return false;
      }
      for (k = 0; k != n; k++) {
        x_0 = a[largestRow][k];
        a[largestRow][k] = a[j][k];
        a[j][k] = x_0;
      }
    }
    ipvt[j] = largestRow;
    if (a[j][j] == 0) {
      console.log("didn't avoid zero");
      return false;
    }
    if (j != n - 1) {
      mult = 1 / a[j][j];
      for (i = j + 1; i != n; i++)
        a[i][j] *= mult;
    }
  }
  return true;
}

function lu_solve(a, n, ipvt, b, cm){
  var sm;
  sm = theSim;
  if (!!sm && sm.usingSparse) {
    $solve(cm.sparseLU, b, b);
    return;
  }
  lu_solve_dense(a, n, ipvt, b);
}

function lu_solve_dense(a, n, ipvt, b){
  var bi, i, j, row, swap, tot;
  for (i = 0; i != n; i++) {
    row = ipvt[i];
    swap = b[row];
    b[row] = b[i];
    b[i] = swap;
    if (swap != 0)
      break;
  }
  bi = i++;
  for (; i < n; i++) {
    row = ipvt[i];
    tot = b[row];
    b[row] = b[i];
    for (j = bi; j < i; j++)
      tot -= a[i][j] * b[j];
    b[i] = tot;
  }
  for (i = n - 1; i >= 0; i--) {
    tot = b[i];
    for (j = i + 1; j != n; j++)
      tot -= a[i][j] * b[j];
    b[i] = tot / a[i][i];
  }
}

function pointKey(p){
  return p.x_0 + ',' + p.y_0 + ',' + p.z_0;
}

defineClass(158, 1, {}, SimulationManager);
_.adjustTimeStep = false;
_.circuitNonLinear = false;
_.converged = false;
_.lastIterTime = 0;
_.maxTimeStep = 0;
_.minTimeStep = 0;
_.subIterations = 0;
_.t = 0;
_.timeStep_0 = 0;
_.timeStepAccum = 0;
_.timeStepCount = 0;
_.usingSparse = false;
_.voltageSourceCount = 0;
var theSim;
var Lcom_lushprojects_circuitjs1_client_SimulationManager_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'SimulationManager', 158);
function SimulationManager$NodeMapEntry(){
  this.node = null;
}

function SimulationManager$NodeMapEntry_0(n){
  this.node = n;
}

defineClass(35, 1, {35:1}, SimulationManager$NodeMapEntry, SimulationManager$NodeMapEntry_0);
var Lcom_lushprojects_circuitjs1_client_SimulationManager$NodeMapEntry_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'SimulationManager/NodeMapEntry', 35);
function SimulationManager$WireSegment(w, b, ep0, ep1){
  this.wire = w;
  this.bit = b;
  this.endpoint0 = ep0;
  this.endpoint1 = ep1;
}

defineClass(36, 1, {36:1}, SimulationManager$WireSegment);
_.bit = 0;
_.current_0 = 0;
_.post = 0;
var Lcom_lushprojects_circuitjs1_client_SimulationManager$WireSegment_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'SimulationManager/WireSegment', 36);
function SparkGapElm(xa, ya, xb, yb, f, st){
  CircuitElm.call(this, xa, ya, xb, yb, f);
  this.onresistance = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.offresistance = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.breakdown = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.holdcurrent = $doubleValue(__parseAndValidateDouble($nextToken(st)));
}

defineClass(69, 4, {4:1, 6:1, 69:1}, SparkGapElm);
_.calculateCurrent = function calculateCurrent_22(){
  var vd;
  vd = this.volts[0] - this.volts[1];
  this.current_1 = vd / this.resistance;
}
;
_.doStep = function doStep_28(){
  this.resistance = this.state?this.onresistance:this.offresistance;
  $stampResistor(this.nodes[0], this.nodes[1], this.resistance);
}
;
_.getDumpType = function getDumpType_54(){
  return 187;
}
;
_.nonLinear_0 = function nonLinear_13(){
  return true;
}
;
_.reset_0 = function reset_24(){
  $reset(this);
  this.state = false;
}
;
_.setPoints = function setPoints_45(){
  var p1;
  $setPoints(this);
  $calcLeads(this, 24);
  p1 = $interpPoint(this.point1, this.point2, (this.dn - 8) / (2 * this.dn));
  $calcArrow(this.point1, p1, 8, 8);
  p1 = $interpPoint(this.point1, this.point2, (this.dn + 8) / (2 * this.dn));
  $calcArrow(this.point2, p1, 8, 8);
}
;
_.stamp = function stamp_37(){
}
;
_.startIteration = function startIteration_12(){
  var vd;
  $wnd.Math.abs(this.current_1) < this.holdcurrent && (this.state = false);
  vd = this.volts[0] - this.volts[1];
  $wnd.Math.abs(vd) > this.breakdown && (this.state = true);
}
;
_.breakdown = 0;
_.holdcurrent = 0;
_.offresistance = 0;
_.onresistance = 0;
_.resistance = 0;
_.state = false;
var Lcom_lushprojects_circuitjs1_client_SparkGapElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'SparkGapElm', 69);
function StopTriggerElm(xa, ya, xb, yb, st){
  CircuitElm.call(this, xa, ya, xb, yb, 0);
  this.triggerVoltage = __parseAndValidateDouble($nextToken(st));
  this.type_0 = __parseAndValidateInt($nextToken(st), 10);
  this.delay = __parseAndValidateDouble($nextToken(st));
}

defineClass(31, 4, {4:1, 6:1, 31:1}, StopTriggerElm);
_.getDumpType = function getDumpType_55(){
  return 408;
}
;
_.getPostCount = function getPostCount_31(){
  return 1;
}
;
_.getVoltageDiff = function getVoltageDiff_18(){
  return this.volts[0];
}
;
_.reset_0 = function reset_25(){
  this.triggered = false;
}
;
_.setPoints = function setPoints_46(){
  $setPoints(this);
  this.lead1 = $interpPoint(this.point1, this.point2, 1 - 8 / this.dn);
}
;
_.stepFinished = function stepFinished_11(){
  this.stopped = false;
  if (!this.triggered && (this.type_0 == 0 && this.volts[0] >= this.triggerVoltage || this.type_0 == 1 && this.volts[0] <= this.triggerVoltage)) {
    this.triggered = true;
    this.triggerTime = sim.t;
  }
  if (this.triggered && sim.t >= this.triggerTime + this.delay) {
    this.triggered = false;
    this.stopped = true;
    app.simRunning = false;
  }
}
;
_.delay = 0;
_.stopped = false;
_.triggerTime = 0;
_.triggerVoltage = 0;
_.triggered = false;
_.type_0 = 0;
var Lcom_lushprojects_circuitjs1_client_StopTriggerElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'StopTriggerElm', 31);
function $hasMoreTokens(this$static){
  if (!this$static.retDelims) {
    while (this$static.pos < this$static.len && $indexOf_0(this$static.delim, fromCodePoint($charAt(this$static.str, this$static.pos))) >= 0)
      ++this$static.pos;
  }
  return this$static.pos < this$static.len;
}

function $nextToken(this$static){
  var start_0;
  if (this$static.pos < this$static.len && $indexOf_0(this$static.delim, fromCodePoint($charAt(this$static.str, this$static.pos))) >= 0) {
    if (this$static.retDelims)
      return $substring_0(this$static.str, this$static.pos, ++this$static.pos);
    while (++this$static.pos < this$static.len && $indexOf_0(this$static.delim, fromCodePoint($charAt(this$static.str, this$static.pos))) >= 0)
    ;
  }
  if (this$static.pos < this$static.len) {
    start_0 = this$static.pos;
    while (++this$static.pos < this$static.len && $indexOf_0(this$static.delim, fromCodePoint($charAt(this$static.str, this$static.pos))) < 0)
    ;
    return $substring_0(this$static.str, start_0, this$static.pos);
  }
  throw toJs(new NoSuchElementException);
}

function StringTokenizer(str){
  StringTokenizer_0.call(this, str, ' \t\n\r\f', false);
}

function StringTokenizer_0(str, delim, returnDelims){
  this.len = str.length;
  this.str = str;
  this.delim = delim;
  this.retDelims = returnDelims;
  this.pos = 0;
}

defineClass(14, 1, {}, StringTokenizer, StringTokenizer_0);
_.len = 0;
_.pos = 0;
_.retDelims = false;
var Lcom_lushprojects_circuitjs1_client_StringTokenizer_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'StringTokenizer', 14);
function $reset_5(this$static){
  this$static.frequency = this$static.minF;
  this$static.freqTime = 0;
  this$static.dir_0 = 1;
  $setParams(this$static);
}

function $setParams(this$static){
  if (this$static.frequency < this$static.minF || this$static.frequency > this$static.maxF) {
    this$static.frequency = this$static.minF;
    this$static.freqTime = 0;
    this$static.dir_0 = 1;
  }
  if ((this$static.flags & 1) == 0) {
    this$static.fadd = this$static.dir_0 * sim.timeStep_0 * (this$static.maxF - this$static.minF) / this$static.sweepTime;
    this$static.fmul = 1;
  }
   else {
    this$static.fadd = 0;
    this$static.fmul = $wnd.Math.pow(this$static.maxF / this$static.minF, this$static.dir_0 * sim.timeStep_0 / this$static.sweepTime);
  }
  this$static.savedTimeStep = sim.timeStep_0;
}

function SweepElm(xa, ya, xb, yb, f, st){
  CircuitElm.call(this, xa, ya, xb, yb, f);
  this.dir_0 = 1;
  this.minF = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.maxF = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.maxV = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.sweepTime = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  $reset_5(this);
}

defineClass(68, 4, {4:1, 6:1, 68:1}, SweepElm);
_.doStep = function doStep_29(){
  $updateVoltageSource(this.voltSource_0, this.v);
}
;
_.getDumpType = function getDumpType_56(){
  return 170;
}
;
_.getPostCount = function getPostCount_32(){
  return 1;
}
;
_.getVoltageDiff = function getVoltageDiff_19(){
  return this.volts[0];
}
;
_.getVoltageSourceCount = function getVoltageSourceCount_23(){
  return 1;
}
;
_.hasGroundConnection = function hasGroundConnection_14(n1){
  return true;
}
;
_.reset_0 = function reset_26(){
  $reset_5(this);
}
;
_.setPoints = function setPoints_47(){
  $setPoints(this);
  this.lead1 = $interpPoint(this.point1, this.point2, 1 - 17 / this.dn);
}
;
_.stamp = function stamp_38(){
  $stampVoltageSource(ground, this.nodes[0], this.voltSource_0);
}
;
_.startIteration = function startIteration_13(){
  sim.timeStep_0 != this.savedTimeStep && $setParams(this);
  this.v = $wnd.Math.sin(this.freqTime) * this.maxV;
  this.freqTime += this.frequency * 2 * $intern_14 * sim.timeStep_0;
  this.frequency = this.frequency * this.fmul + this.fadd;
  if (this.frequency >= this.maxF && this.dir_0 == 1) {
    if ((this.flags & 2) != 0) {
      this.fadd = -this.fadd;
      this.fmul = 1 / this.fmul;
      this.dir_0 = -1;
    }
     else 
      this.frequency = this.minF;
  }
  if (this.frequency <= this.minF && this.dir_0 == -1) {
    this.fadd = -this.fadd;
    this.fmul = 1 / this.fmul;
    this.dir_0 = 1;
  }
}
;
_.validate = function validate_14(){
  return $validateRailNode(this, 0);
}
;
_.dir_0 = 0;
_.fadd = 0;
_.fmul = 0;
_.freqTime = 0;
_.frequency = 0;
_.maxF = 0;
_.maxV = 0;
_.minF = 0;
_.savedTimeStep = 0;
_.sweepTime = 0;
_.v = 0;
var Lcom_lushprojects_circuitjs1_client_SweepElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'SweepElm', 68);
function Switch2Elm(xa, ya, xb, yb, f, st){
  SwitchElm.call(this, xa, ya, xb, yb, f, st);
  this.link_0 = (new Integer_0($nextToken(st))).value_0;
  this.throwCount = 2;
  try {
    this.throwCount = (new Integer_0($nextToken(st))).value_0;
  }
   catch ($e0) {
    $e0 = toJava($e0);
    if (!instanceOf($e0, 9))
      throw toJs($e0);
  }
}

defineClass(39, 21, {4:1, 6:1, 39:1, 21:1}, Switch2Elm);
_.calculateCurrent = function calculateCurrent_23(){
  this.position == 2 && (this.flags & 1) != 0 && this.throwCount == 2?(this.current_1 = 0):this.resistance > 0 && (this.current_1 = (this.volts[0] - this.volts[this.position + 1]) / this.resistance);
}
;
_.getConnection = function getConnection_18(n1, n2){
  if (this.position == 2 && (this.flags & 1) != 0 && this.throwCount == 2)
    return false;
  return $comparePair(n1, n2, 0, 1 + this.position);
}
;
_.getCurrentIntoNode = function getCurrentIntoNode_18(n){
  if (n == 0)
    return -this.current_1;
  if (n == this.position + 1)
    return this.current_1;
  return 0;
}
;
_.getDumpType = function getDumpType_57(){
  return 83;
}
;
_.getPost = function getPost_14(n){
  return n == 0?this.point1:this.swposts[n - 1];
}
;
_.getPostCount = function getPostCount_33(){
  return 1 + this.throwCount;
}
;
_.getVoltageSourceCount = function getVoltageSourceCount_24(){
  if (this.position == 2 && (this.flags & 1) != 0 && this.throwCount == 2)
    return 0;
  return this.resistance > 0?0:1;
}
;
_.isRemovableWire = function isRemovableWire_6(){
  return false;
}
;
_.isWireEquivalent = function isWireEquivalent_8(){
  return this.resistance == 0;
}
;
_.setPoints = function setPoints_48(){
  var hs, i;
  $setPoints_6(this);
  $calcLeads(this, 32);
  this.swposts = $newPointArray(this.throwCount);
  this.swpoles = $newPointArray(2 + this.throwCount);
  for (i = 0; i != this.throwCount; i++) {
    hs = -16 * (i - ((this.throwCount - 1) / 2 | 0));
    this.throwCount == 2 && i == 0 && (hs = 16);
    $interpPoint_2(this.lead1, this.lead2, this.swpoles[i], 1, hs);
    $interpPoint_2(this.point1, this.point2, this.swposts[i], 1, hs);
  }
  this.swpoles[i] = this.lead2;
}
;
_.setVoltageSource = function setVoltageSource_9(n, v){
  this.voltSource_0 = v;
  $setNodes(v, this.nodes[0], this.nodes[this.position + 1]);
}
;
_.stamp = function stamp_39(){
  if (this.position == 2 && (this.flags & 1) != 0 && this.throwCount == 2)
    return;
  this.resistance > 0?$stampResistor(this.nodes[0], this.nodes[this.position + 1], this.resistance):$stampVoltageSource_0(this.nodes[0], this.nodes[this.position + 1], this.voltSource_0, 0);
}
;
_.validate = function validate_15(){
  var fpi;
  if (this.position == 2 && (this.flags & 1) != 0 && this.throwCount == 2)
    return true;
  if (this.resistance > 0)
    return true;
  fpi = new FindPathInfo(2, this, this.nodes[0], sim);
  if ($findPath(fpi, $getNode(this, 1 + this.position))) {
    this.resistance = $intern_17;
    return false;
  }
  return true;
}
;
_.link_0 = 0;
_.throwCount = 0;
var Lcom_lushprojects_circuitjs1_client_Switch2Elm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'Switch2Elm', 39);
function TFlipFlopElm(xa, ya, xb, yb, f, st){
  $clinit_ChipElm();
  ChipElm.call(this, xa, ya, xb, yb, f, st);
  this.pins[2].value_0 = !this.pins[1].value_0;
}

defineClass(148, 18, $intern_20, TFlipFlopElm);
_.execute_0 = function execute_8(){
  this.pins[3].value_0 && !this.lastClock && this.pins[0].value_0 && (this.pins[1].value_0 = !this.pins[1].value_0);
  (this.flags & 4) != 0 && this.pins[5].value_0 && (this.pins[1].value_0 = true);
  ((this.flags & 2) != 0 || (this.flags & 4) != 0) && this.pins[4].value_0 && (this.pins[1].value_0 = false);
  this.pins[2].value_0 = !this.pins[1].value_0;
  this.lastClock = this.pins[3].value_0;
}
;
_.getDumpType = function getDumpType_58(){
  return 193;
}
;
_.getPostCount = function getPostCount_34(){
  return 4 + ((this.flags & 2) != 0 || (this.flags & 4) != 0?1:0) + ((this.flags & 4) != 0?1:0);
}
;
_.getVoltageSourceCount = function getVoltageSourceCount_25(){
  return 2;
}
;
_.reset_0 = function reset_27(){
  $reset_1(this);
  this.volts[2] = this.highVoltage;
  this.pins[2].value_0 = true;
}
;
_.setupPins = function setupPins_7(){
  this.sizeX = 2;
  this.sizeY = 3;
  this.pins = initUnidimensionalArray(Lcom_lushprojects_circuitjs1_client_ChipElm$Pin_2_classLit, $intern_6, 12, 4 + ((this.flags & 2) != 0 || (this.flags & 4) != 0?1:0) + ((this.flags & 4) != 0?1:0), 0, 1);
  this.pins[0] = new ChipElm$Pin(this, 0, 2, 'T');
  this.pins[1] = new ChipElm$Pin(this, 0, 3, 'Q');
  this.pins[1].output = this.pins[1].state = true;
  this.pins[2] = new ChipElm$Pin(this, (this.flags & 4) != 0?1:2, 3, 'Q');
  this.pins[2].output = true;
  this.pins[3] = new ChipElm$Pin(this, 1, 2, '');
  this.pins[3].clock = true;
  if ((this.flags & 4) != 0) {
    this.pins[5] = new ChipElm$Pin(this, 2, 2, 'S');
    this.pins[4] = new ChipElm$Pin(this, 2, 3, 'R');
  }
   else {
    ((this.flags & 2) != 0 || (this.flags & 4) != 0) && (this.pins[4] = new ChipElm$Pin(this, 2, 2, 'R'));
  }
}
;
var Lcom_lushprojects_circuitjs1_client_TFlipFlopElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'TFlipFlopElm', 148);
function TappedTransformerElm(xa, ya, xb, yb, f, st){
  CircuitElm.call(this, xa, ya, xb, yb, f);
  this.inductance = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.ratio = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.current_0 = initUnidimensionalArray(D_classLit, $intern_7, 5, 4, 15, 1);
  this.curcount = initUnidimensionalArray(D_classLit, $intern_7, 5, 4, 15, 1);
  this.current_0[0] = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.current_0[1] = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  try {
    this.current_0[2] = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  }
   catch ($e0) {
    $e0 = toJava($e0);
    if (!instanceOf($e0, 9))
      throw toJs($e0);
  }
  this.couplingCoef = 0.99;
  try {
    this.couplingCoef = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  }
   catch ($e1) {
    $e1 = toJava($e1);
    if (!instanceOf($e1, 9))
      throw toJs($e1);
  }
  this.voltdiff = initUnidimensionalArray(D_classLit, $intern_7, 5, 3, 15, 1);
  this.curSourceValue = initUnidimensionalArray(D_classLit, $intern_7, 5, 3, 15, 1);
  this.a = initUnidimensionalArray(D_classLit, $intern_7, 5, 9, 15, 1);
}

defineClass(90, 4, {4:1, 6:1, 90:1}, TappedTransformerElm);
_.calculateCurrent = function calculateCurrent_24(){
  var i, j;
  this.voltdiff[0] = this.volts[0] - this.volts[1];
  this.voltdiff[1] = this.volts[2] - this.volts[3];
  this.voltdiff[2] = this.volts[3] - this.volts[4];
  for (i = 0; i != 3; i++) {
    this.current_0[i] = this.curSourceValue[i];
    for (j = 0; j != 3; j++)
      this.current_0[i] += this.a[i * 3 + j] * this.voltdiff[j];
  }
  this.current_0[3] = this.current_0[1] - this.current_0[2];
}
;
_.doStep = function doStep_30(){
  $stampCurrentSource(this.nodes[0], this.nodes[1], this.curSourceValue[0]);
  $stampCurrentSource(this.nodes[2], this.nodes[3], this.curSourceValue[1]);
  $stampCurrentSource(this.nodes[3], this.nodes[4], this.curSourceValue[2]);
}
;
_.getConnection = function getConnection_19(n1, n2){
  if (n1 == 0 && n2 == 1 || n1 == 1 && n2 == 0)
    return true;
  if (n1 == 2 && n2 == 3 || n1 == 3 && n2 == 2)
    return true;
  if (n1 == 3 && n2 == 4 || n1 == 4 && n2 == 3)
    return true;
  if (n1 == 2 && n2 == 4 || n1 == 4 && n2 == 2)
    return true;
  return false;
}
;
_.getCurrentIntoNode = function getCurrentIntoNode_19(n){
  if (n == 0)
    return -this.current_0[0];
  if (n == 1)
    return this.current_0[0];
  if (n == 2)
    return -this.current_0[1];
  if (n == 3)
    return this.current_0[3];
  return this.current_0[2];
}
;
_.getDumpType = function getDumpType_59(){
  return 169;
}
;
_.getMatrixConnection = function getMatrixConnection_6(n1, n2){
  return true;
}
;
_.getPost = function getPost_15(n){
  return this.ptEnds[n];
}
;
_.getPostCount = function getPostCount_35(){
  return 5;
}
;
_.reset_0 = function reset_28(){
  this.current_0[0] = this.current_0[1] = this.current_0[2] = this.current_0[3] = this.volts[0] = this.volts[1] = this.volts[2] = this.volts[3] = this.volts[4] = this.curcount[0] = this.curcount[1] = this.curcount[2] = 0;
  this.curSourceValue[0] = this.curSourceValue[1] = this.curSourceValue[2] = 0;
}
;
_.setPoints = function setPoints_49(){
  var b, cd, ce, hs, i;
  $setPoints(this);
  this.flip = (this.flags & 1) != 0?-1:1;
  hs = 32 * this.flip;
  this.ptEnds = $newPointArray(5);
  this.ptCoil = $newPointArray(5);
  this.ptCore = $newPointArray(4);
  this.ptEnds[0] = this.point1;
  this.ptEnds[2] = this.point2;
  $interpPoint_2(this.point1, this.point2, this.ptEnds[1], 0, -hs * 2);
  $interpPoint_2(this.point1, this.point2, this.ptEnds[3], 1, -hs);
  $interpPoint_2(this.point1, this.point2, this.ptEnds[4], 1, -hs * 2);
  ce = 0.5 - 12 / this.dn;
  cd = 0.5 - 2 / this.dn;
  $interpPoint_1(this.ptEnds[0], this.ptEnds[2], this.ptCoil[0], ce);
  $interpPoint_2(this.ptEnds[0], this.ptEnds[2], this.ptCoil[1], ce, -hs * 2);
  $interpPoint_1(this.ptEnds[0], this.ptEnds[2], this.ptCoil[2], 1 - ce);
  $interpPoint_2(this.ptEnds[0], this.ptEnds[2], this.ptCoil[3], 1 - ce, -hs);
  $interpPoint_2(this.ptEnds[0], this.ptEnds[2], this.ptCoil[4], 1 - ce, -hs * 2);
  for (i = 0; i != 2; i++) {
    b = -hs * i * 2;
    $interpPoint_2(this.ptEnds[0], this.ptEnds[2], this.ptCore[i], cd, b);
    $interpPoint_2(this.ptEnds[0], this.ptEnds[2], this.ptCore[i + 2], 1 - cd, b);
  }
}
;
_.stamp = function stamp_40(){
  var det, i, l1, l2, m1, m2;
  l1 = this.inductance;
  l2 = this.inductance * this.ratio * this.ratio / 4;
  m1 = this.couplingCoef * $wnd.Math.sqrt(l1 * l2);
  m2 = this.couplingCoef * l2;
  this.a[0] = l2 + m2;
  this.a[1] = this.a[2] = this.a[3] = this.a[6] = -m1;
  this.a[4] = this.a[8] = (l1 * l2 - m1 * m1) / (l2 - m2);
  this.a[5] = this.a[7] = (m1 * m1 - l1 * m2) / (l2 - m2);
  det = l1 * (l2 + m2) - 2 * m1 * m1;
  for (i = 0; i != 9; i++)
    this.a[i] *= ((this.flags & 2) == 0?sim.timeStep_0 / 2:sim.timeStep_0) / det;
  $stampConductance(this.nodes[0], this.nodes[1], this.a[0]);
  $stampVCCurrentSource(this.nodes[0], this.nodes[1], this.nodes[2], this.nodes[3], this.a[1]);
  $stampVCCurrentSource(this.nodes[0], this.nodes[1], this.nodes[3], this.nodes[4], this.a[2]);
  $stampVCCurrentSource(this.nodes[2], this.nodes[3], this.nodes[0], this.nodes[1], this.a[3]);
  $stampConductance(this.nodes[2], this.nodes[3], this.a[4]);
  $stampVCCurrentSource(this.nodes[2], this.nodes[3], this.nodes[3], this.nodes[4], this.a[5]);
  $stampVCCurrentSource(this.nodes[3], this.nodes[4], this.nodes[0], this.nodes[1], this.a[6]);
  $stampVCCurrentSource(this.nodes[3], this.nodes[4], this.nodes[2], this.nodes[3], this.a[7]);
  $stampConductance(this.nodes[3], this.nodes[4], this.a[8]);
  for (i = 0; i != 5; i++)
  ;
}
;
_.startIteration = function startIteration_14(){
  var i, j;
  this.voltdiff[0] = this.volts[0] - this.volts[1];
  this.voltdiff[1] = this.volts[2] - this.volts[3];
  this.voltdiff[2] = this.volts[3] - this.volts[4];
  for (i = 0; i != 3; i++) {
    this.curSourceValue[i] = this.current_0[i];
    if ((this.flags & 2) == 0)
      for (j = 0; j != 3; j++)
        this.curSourceValue[i] += this.a[i * 3 + j] * this.voltdiff[j];
  }
}
;
_.couplingCoef = 0;
_.flip = 0;
_.inductance = 0;
_.ratio = 0;
var Lcom_lushprojects_circuitjs1_client_TappedTransformerElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'TappedTransformerElm', 90);
function TestPointElm(xa, ya, xb, yb, st){
  CircuitElm.call(this, xa, ya, xb, yb, 1);
  this.zerocount = 0;
  this.rmsV = 0;
  this.maxV = 0;
  this.minV = 0;
  this.binaryLevel = 0;
  this.increasingV = true;
  this.decreasingV = true;
  this.meter = (new Integer_0($nextToken(st))).value_0;
  (this.flags & 1) != 0?(this.label_0 = unescape_0($nextToken(st))):(this.label_0 = 'TP');
}

defineClass(61, 4, {4:1, 6:1, 61:1}, TestPointElm);
_.getDumpType = function getDumpType_60(){
  return 368;
}
;
_.getPostCount = function getPostCount_36(){
  return 1;
}
;
_.getVoltageDiff = function getVoltageDiff_20(){
  return this.volts[0];
}
;
_.setPoints = function setPoints_50(){
  $setPoints(this);
  this.lead1 = new Point;
}
;
_.stepFinished = function stepFinished_12(){
  if (sim.timeStepCount == this.lastStepCount)
    return;
  this.lastStepCount = sim.timeStepCount;
  ++this.count;
  this.total += this.volts[0] * this.volts[0];
  this.volts[0] < 2.5?(this.binaryLevel = 0):(this.binaryLevel = 1);
  if (this.volts[0] > this.maxV && this.increasingV) {
    this.maxV = this.volts[0];
    this.increasingV = true;
    this.decreasingV = false;
  }
  if (this.volts[0] < this.maxV && this.increasingV) {
    this.lastMaxV = this.maxV;
    sub_1(fromDouble_0(Date.now()), this.periodStart);
    this.periodStart = fromDouble_0(Date.now());
    sub_1(fromDouble_0(Date.now()), this.pulseStart);
    this.minV = this.volts[0];
    this.increasingV = false;
    this.decreasingV = true;
    this.total = this.total / this.count;
    this.rmsV = $wnd.Math.sqrt(this.total);
    isNaN(this.rmsV) && (this.rmsV = 0);
    this.count = 0;
    this.total = 0;
  }
  if (this.volts[0] < this.minV && this.decreasingV) {
    this.minV = this.volts[0];
    this.increasingV = false;
    this.decreasingV = true;
  }
  if (this.volts[0] > this.minV && this.decreasingV) {
    this.lastMinV = this.minV;
    this.pulseStart = fromDouble_0(Date.now());
    this.maxV = this.volts[0];
    this.increasingV = true;
    this.decreasingV = false;
    this.total = this.total / this.count;
    this.rmsV = $wnd.Math.sqrt(this.total);
    isNaN(this.rmsV) && (this.rmsV = 0);
    this.count = 0;
    this.total = 0;
  }
  if (this.volts[0] == 0) {
    ++this.zerocount;
    if (this.zerocount > 5) {
      this.total = 0;
      this.rmsV = 0;
      this.maxV = 0;
      this.minV = 0;
    }
  }
   else {
    this.zerocount = 0;
  }
}
;
_.binaryLevel = 0;
_.count = 0;
_.decreasingV = false;
_.increasingV = false;
_.lastMaxV = 0;
_.lastMinV = 0;
_.lastStepCount = 0;
_.maxV = 0;
_.meter = 0;
_.minV = 0;
_.periodStart = 0;
_.pulseStart = 0;
_.rmsV = 0;
_.total = 0;
_.zerocount = 0;
var Lcom_lushprojects_circuitjs1_client_TestPointElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'TestPointElm', 61);
function $calcResistance_0(this$static, tempr){
  return toDouble_0(fromDouble_0($wnd.Math.round(this$static.r25 * $wnd.Math.exp(this$static.b25100 * (1 / (tempr + this$static.t0) - 1 / this$static.t25)))));
}

function $setPoints_12(this$static){
  $setPoints(this$static);
  $calcLeads(this$static, 32);
  this$static.temperature = toDouble_0(fromDouble_0($wnd.Math.round(this$static.position * (this$static.maxTempr - this$static.minTempr) + this$static.minTempr)));
  this$static.resistance = $calcResistance_0(this$static, this$static.temperature);
  new Point;
  new Point;
}

function ThermistorNTCElm(xa, ya, xb, yb, f, st){
  var kelvin1, kelvin2;
  CircuitElm.call(this, xa, ya, xb, yb, f);
  this.t0 = 273.15;
  this.t25 = this.t0 + 25;
  this.r25 = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.r50 = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.minTempr = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.maxTempr = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.position = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.rneg40 = $calcResistance_0(this, this.minTempr);
  this.b25100 = (kelvin1 = this.t0 + 25 , kelvin2 = this.t0 + 50 , ($wnd.Math.log(this.r25) - $wnd.Math.log(this.r50)) / (1 / kelvin1 - 1 / kelvin2));
  this.temperature = toDouble_0(fromDouble_0($wnd.Math.round(this.position * (this.maxTempr - this.minTempr) + this.minTempr)));
  this.resistance = $calcResistance_0(this, this.temperature);
  unescape_0($nextToken(st));
}

defineClass(67, 4, {4:1, 6:1, 67:1}, ThermistorNTCElm);
_.calculateCurrent = function calculateCurrent_25(){
  this.current_1 = (this.volts[0] - this.volts[1]) / this.resistance;
}
;
_.execute = function execute_9(){
  $setPoints_12(this);
}
;
_.getDumpType = function getDumpType_61(){
  return 350;
}
;
_.getPostCount = function getPostCount_37(){
  return 2;
}
;
_.setPoints = function setPoints_51(){
  $setPoints_12(this);
}
;
_.stamp = function stamp_41(){
  this.temperature = toDouble_0(fromDouble_0($wnd.Math.round(this.position * (this.maxTempr - this.minTempr) + this.minTempr)));
  this.resistance = $calcResistance_0(this, this.temperature);
  $stampResistor(this.nodes[0], this.nodes[1], this.resistance);
}
;
_.b25100 = 0;
_.maxTempr = 0;
_.minTempr = 0;
_.position = 0;
_.r25 = 0;
_.r50 = 0;
_.resistance = 0;
_.rneg40 = 0;
_.t0 = 0;
_.t25 = 0;
_.temperature = 0;
var Lcom_lushprojects_circuitjs1_client_ThermistorNTCElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'ThermistorNTCElm', 67);
function ThreePhaseMotorElm(xa, ya, xb, yb, st){
  CircuitElm.call(this, xa, ya, xb, yb, 0);
  this.coilNodes = stampJavaTypeInfo(getClassLiteralForArray(I_classLit, 1), $intern_12, 5, 15, [6, 1, 8, 3, 10, 5, 7, 9, 11, 12]);
  this.angle = $intern_16;
  this.speed = 0;
  this.Rs = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.Rr = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.Ls = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.Lr = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.Lm = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.b = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  try {
    this.J = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  }
   catch ($e0) {
    $e0 = toJava($e0);
    if (instanceOf($e0, 9)) {
      this.J = 1;
    }
     else 
      throw toJs($e0);
  }
  this.voltSources = initUnidimensionalArray(Lcom_lushprojects_circuitjs1_client_VoltageSource_2_classLit, $intern_6, 34, 2, 0, 1);
  this.coilCurrents = initUnidimensionalArray(D_classLit, $intern_7, 5, 5, 15, 1);
}

defineClass(65, 4, {4:1, 6:1, 65:1}, ThreePhaseMotorElm);
_.calculateCurrent = function calculateCurrent_26(){
  var i, j, n1, n2, ni, val, voltdiff;
  if (this.nodeCurrents == null)
    return;
  for (i = 0; i != 13; i++)
    this.nodeCurrents[i] = 0;
  for (i = 0; i != 5; i++) {
    val = this.coilCurSourceValues[i];
    if (this.xformMatrix != null) {
      for (j = 0; j != 5; j++) {
        n1 = this.coilNodes[j * 2];
        n2 = this.coilNodes[j * 2 + 1];
        voltdiff = this.volts[n1] - this.volts[n2];
        val += voltdiff * this.xformMatrix[i][j];
      }
    }
    this.coilCurrents[i] = val;
    ni = this.coilNodes[i];
    this.nodeCurrents[ni] += val;
    this.nodeCurrents[ni + 1] -= val;
  }
}
;
_.doStep = function doStep_31(){
  var i, n1, n2;
  for (i = 0; i != 5; i++) {
    n1 = this.coilNodes[i * 2];
    n2 = this.coilNodes[i * 2 + 1];
    $stampCurrentSource(this.nodes[n1], this.nodes[n2], this.coilCurSourceValues[i]);
  }
  $updateVoltageSource(this.voltSources[0], -this.vs1value);
  $updateVoltageSource(this.voltSources[1], -this.vs2value);
}
;
_.getConnection = function getConnection_20(n1, n2){
  return true;
}
;
_.getCurrentIntoNode = function getCurrentIntoNode_20(n){
  if (n % 2 == 1)
    return this.coilCurrents[n / 2 | 0];
  return -this.coilCurrents[n / 2 | 0];
}
;
_.getDumpType = function getDumpType_62(){
  return 427;
}
;
_.getInternalNodeCount = function getInternalNodeCount_7(){
  return 7;
}
;
_.getPost = function getPost_16(n){
  return this.posts[n];
}
;
_.getPostCount = function getPostCount_38(){
  return 6;
}
;
_.getVoltageSourceCount = function getVoltageSourceCount_26(){
  return 2;
}
;
_.hasGroundConnection = function hasGroundConnection_15(n1){
  return false;
}
;
_.reset_0 = function reset_29(){
  $reset(this);
  this.speed = 0;
  this.coilCurSourceValues = initUnidimensionalArray(D_classLit, $intern_7, 5, 5, 15, 1);
  this.coilCurrents = initUnidimensionalArray(D_classLit, $intern_7, 5, 5, 15, 1);
}
;
_.setPoints = function setPoints_52(){
  var i, q;
  $setPoints(this);
  this.posts = $newPointArray(6);
  this.leads = $newPointArray(6);
  q = $wnd.Math.abs(this.dy) > $wnd.Math.abs(this.dx)?-1:1;
  for (i = 0; i != 3; i++) {
    $interpPoint_2(this.point1, this.point2, this.posts[i * 2], 0, -q * 32 * (i - 1));
    $interpPoint_2(this.point1, this.point2, this.leads[i * 2], 0.45, -q * 32 * (i - 1));
    $interpPoint_2(this.point1, this.point2, this.posts[i * 2 + 1], 1, q * 32 * (i - 1));
    $interpPoint_2(this.point1, this.point2, this.leads[i * 2 + 1], 0.55, q * 32 * (i - 1));
  }
  $interpPoint(this.point1, this.point2, 0.5);
  $allocNodes(this);
}
;
_.setVoltageSource = function setVoltageSource_10(n, v){
  this.voltSources[n] = v;
  n == 0?$setNodes(v, this.nodes[7], ground):$setNodes(v, this.nodes[11], ground);
}
;
_.stamp = function stamp_42(){
  var Lr2, coilInductances, couplingCoefs, i, j, k0, n001, n002, n003, n004, n005, n006, n007, ni1_ind, ni2_ind, nj1_ind, nj2_ind, ts;
  n001 = this.nodes[6];
  n002 = this.nodes[7];
  n003 = this.nodes[8];
  n004 = this.nodes[9];
  n005 = this.nodes[10];
  n006 = this.nodes[11];
  n007 = this.nodes[12];
  $stampResistor(this.nodes[0], n001, this.Rs);
  $stampResistor(this.nodes[2], n003, this.Rs);
  $stampResistor(this.nodes[4], n005, this.Rs);
  $stampResistor(n004, ground, 1.5 * this.Rr);
  $stampResistor(n007, ground, 1.5 * this.Rr);
  Lr2 = this.Lr * 1.5;
  coilInductances = stampJavaTypeInfo(getClassLiteralForArray(D_classLit, 1), $intern_7, 5, 15, [this.Ls, this.Ls, this.Ls, Lr2, Lr2]);
  couplingCoefs = initMultidimensionalArray(D_classLit, [$intern_6, $intern_7], [8, 5], 15, [5, 5], 2);
  this.xformMatrix = initMultidimensionalArray(D_classLit, [$intern_6, $intern_7], [8, 5], 15, [5, 5], 2);
  for (i = 0; i != 5; i++)
    this.xformMatrix[i][i] = coilInductances[i];
  k0 = this.Lm / $wnd.Math.sqrt(this.Ls * Lr2);
  couplingCoefs[0][3] = couplingCoefs[3][0] = k0;
  couplingCoefs[1][3] = couplingCoefs[3][1] = -k0 / 2;
  couplingCoefs[1][4] = couplingCoefs[4][1] = k0 * $wnd.Math.sqrt(3) / 2;
  couplingCoefs[2][3] = couplingCoefs[3][2] = -k0 / 2;
  couplingCoefs[2][4] = couplingCoefs[4][2] = -k0 * $wnd.Math.sqrt(3) / 2;
  for (i = 0; i != 5; i++)
    for (j = 0; j != i; j++)
      this.xformMatrix[i][j] = this.xformMatrix[j][i] = couplingCoefs[i][j] * $wnd.Math.sqrt(coilInductances[i] * coilInductances[j]);
  invertMatrix(this.xformMatrix, 5);
  ts = sim.timeStep_0;
  for (i = 0; i != 5; i++)
    for (j = 0; j != 5; j++) {
      this.xformMatrix[i][j] *= ts;
      ni1_ind = this.coilNodes[i * 2];
      nj1_ind = this.coilNodes[j * 2];
      ni2_ind = this.coilNodes[i * 2 + 1];
      nj2_ind = this.coilNodes[j * 2 + 1];
      i == j?$stampConductance(this.nodes[ni1_ind], this.nodes[ni2_ind], this.xformMatrix[i][i]):$stampVCCurrentSource(this.nodes[ni1_ind], this.nodes[ni2_ind], this.nodes[nj1_ind], this.nodes[nj2_ind], this.xformMatrix[i][j]);
    }
  for (i = 0; i != 10; i++)
  ;
  $stampVoltageSource(n002, ground, this.voltSources[0]);
  $stampVoltageSource(n006, ground, this.voltSources[1]);
  (this.coilCurSourceValues == null || this.coilCurSourceValues.length != 5) && (this.coilCurSourceValues = initUnidimensionalArray(D_classLit, $intern_7, 5, 5, 15, 1));
  (this.coilCurrents == null || this.coilCurrents.length != 5) && (this.coilCurrents = initUnidimensionalArray(D_classLit, $intern_7, 5, 5, 15, 1));
  (this.nodeCurrents == null || this.nodeCurrents.length != 13) && (this.nodeCurrents = initUnidimensionalArray(D_classLit, $intern_7, 5, 13, 15, 1));
}
;
_.startIteration = function startIteration_15(){
  var i, torque, val;
  for (i = 0; i != 5; i++) {
    val = this.coilCurrents[i];
    this.coilCurSourceValues[i] = val;
  }
  torque = 2 * $wnd.Math.sqrt(3) / 2 * this.Lm * ((this.coilCurrents[1] - this.coilCurrents[2]) * this.coilCurrents[3] - $wnd.Math.sqrt(3) * this.coilCurrents[0] * this.coilCurrents[4]);
  this.speed += sim.timeStep_0 * (torque - this.b * this.speed) / this.J;
  this.angle = this.angle + this.speed * sim.timeStep_0;
  this.vs1value = -2 * this.speed * (this.Lm * $wnd.Math.sqrt(3) / 2 * (this.coilCurrents[1] - this.coilCurrents[2]) + 1.5 * this.Lr * this.coilCurrents[4]);
  this.vs2value = 2 * this.speed * (1.5 * this.Lm * this.coilCurrents[0] + 1.5 * this.Lr * this.coilCurrents[3]);
}
;
_.J = 0;
_.Lm = 0;
_.Lr = 0;
_.Ls = 0;
_.Rr = 0;
_.Rs = 0;
_.angle = 0;
_.b = 0;
_.speed = 0;
_.vs1value = 0;
_.vs2value = 0;
var Lcom_lushprojects_circuitjs1_client_ThreePhaseMotorElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'ThreePhaseMotorElm', 65);
function $reset_6(this$static){
  if (sim.maxTimeStep == 0)
    return;
  this$static.lenSteps = round_int(this$static.delay / sim.maxTimeStep);
  if (this$static.lenSteps > $intern_28)
    this$static.voltageL = this$static.voltageR = null;
  else {
    this$static.voltageL = initUnidimensionalArray(D_classLit, $intern_7, 5, this$static.lenSteps, 15, 1);
    this$static.voltageR = initUnidimensionalArray(D_classLit, $intern_7, 5, this$static.lenSteps, 15, 1);
  }
  this$static.ptr = 0;
  $reset(this$static);
  this$static.lastStepCount = 0;
}

function TransLineElm(xa, ya, xb, yb, f, st){
  CircuitElm.call(this, xa, ya, xb, yb, f);
  this.delay = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.imped = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.width_0 = (new Integer_0($nextToken(st))).value_0;
  $nextToken(st);
  $reset_6(this);
}

defineClass(54, 4, {4:1, 6:1, 54:1}, TransLineElm);
_.doStep = function doStep_32(){
  var nextPtr;
  if (this.voltageL == null) {
    $stop(sim, 'Transmission line delay too large!');
    return;
  }
  nextPtr = (this.ptr + 1) % this.lenSteps;
  $updateVoltageSource(this.voltSource1, -this.voltageR[nextPtr]);
  $updateVoltageSource(this.voltSource2, -this.voltageL[nextPtr]);
  if ($wnd.Math.abs(this.volts[0]) > 1.0E-5 || $wnd.Math.abs(this.volts[1]) > 1.0E-5) {
    $stop(sim, 'Need to ground transmission line!');
    return;
  }
}
;
_.getConnection = function getConnection_21(n1, n2){
  return false;
}
;
_.getCurrentIntoNode = function getCurrentIntoNode_21(n){
  if (n == 0)
    return this.current1;
  if (n == 2)
    return -this.current1;
  if (n == 3)
    return -this.current2;
  return this.current2;
}
;
_.getDumpType = function getDumpType_63(){
  return 171;
}
;
_.getInternalNodeCount = function getInternalNodeCount_8(){
  return 2;
}
;
_.getMatrixConnection = function getMatrixConnection_7(n1, n2){
  return n1 % 2 == n2 % 2;
}
;
_.getPost = function getPost_17(n){
  return this.posts[n];
}
;
_.getPostCount = function getPostCount_39(){
  return 4;
}
;
_.getVoltageSourceCount = function getVoltageSourceCount_27(){
  return 2;
}
;
_.hasGroundConnection = function hasGroundConnection_16(n1){
  return false;
}
;
_.reset_0 = function reset_30(){
  $reset_6(this);
}
;
_.setCurrent = function setCurrent_8(vs, c){
  vs == this.voltSource1?(this.current1 = c):(this.current2 = c);
}
;
_.setPoints = function setPoints_53(){
  var ds, p3, p4, sep;
  $setPoints(this);
  ds = this.dy == 0?sign(this.dx):-sign(this.dy);
  p3 = $interpPoint_0(this.point1, this.point2, 0, -this.width_0 * ds);
  p4 = $interpPoint_0(this.point1, this.point2, 1, -this.width_0 * ds);
  sep = app.gridSize / 2 | 0;
  $interpPoint_0(this.point1, this.point2, 0, -((this.width_0 / 2 | 0) - sep) * ds);
  $interpPoint_0(this.point1, this.point2, 1, -((this.width_0 / 2 | 0) - sep) * ds);
  $interpPoint_0(this.point1, this.point2, 0, -((this.width_0 / 2 | 0) + sep) * ds);
  $interpPoint_0(this.point1, this.point2, 1, -((this.width_0 / 2 | 0) + sep) * ds);
  this.posts = stampJavaTypeInfo(getClassLiteralForArray(Lcom_lushprojects_circuitjs1_client_Point_2_classLit, 1), $intern_6, 11, 0, [p3, p4, this.point1, this.point2]);
}
;
_.setVoltageSource = function setVoltageSource_11(n, v){
  if (n == 0) {
    this.voltSource1 = v;
    $setNodes(v, this.nodes[4], this.nodes[0]);
  }
   else {
    this.voltSource2 = v;
    $setNodes(v, this.nodes[5], this.nodes[1]);
  }
}
;
_.stamp = function stamp_43(){
  $stampVoltageSource(this.nodes[4], this.nodes[0], this.voltSource1);
  $stampVoltageSource(this.nodes[5], this.nodes[1], this.voltSource2);
  $stampResistor(this.nodes[2], this.nodes[4], this.imped);
  $stampResistor(this.nodes[3], this.nodes[5], this.imped);
}
;
_.startIteration = function startIteration_16(){
  if (this.voltageL == null) {
    $stop(sim, 'Transmission line delay too large!');
    return;
  }
  this.voltageL[this.ptr] = this.volts[2] - this.volts[0] + this.volts[2] - this.volts[4];
  this.voltageR[this.ptr] = this.volts[3] - this.volts[1] + this.volts[3] - this.volts[5];
}
;
_.stepFinished = function stepFinished_13(){
  if (sim.timeStepCount == this.lastStepCount)
    return;
  this.lastStepCount = sim.timeStepCount;
  this.ptr = (this.ptr + 1) % this.lenSteps;
}
;
_.current1 = 0;
_.current2 = 0;
_.delay = 0;
_.imped = 0;
_.lastStepCount = 0;
_.lenSteps = 0;
_.ptr = 0;
_.width_0 = 0;
var Lcom_lushprojects_circuitjs1_client_TransLineElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'TransLineElm', 54);
function $calcEffectiveInductance_0(l0, i, isat){
  var ratio;
  if (isat <= 0)
    return l0;
  ratio = i / isat;
  return l0 / (1 + ratio * ratio);
}

function $computeCoefficients(this$static, l1, l2, m){
  var deti, ts;
  deti = 1 / (l1 * l2 - m * m);
  ts = (this$static.flags & 2) == 0?sim.timeStep_0 / 2:sim.timeStep_0;
  this$static.a1 = l2 * deti * ts;
  this$static.a2 = -m * deti * ts;
  this$static.a3 = -m * deti * ts;
  this$static.a4 = l1 * deti * ts;
}

function TransformerElm(xa, ya, xb, yb, f, st){
  CircuitElm.call(this, xa, ya, xb, yb, f);
  (this.flags & 8) != 0?(this.width_0 = -(32 > (xb - xa < 0?-(xb - xa):xb - xa)?32:xb - xa < 0?-(xb - xa):xb - xa)):(this.width_0 = 32 > (yb - ya < 0?-(yb - ya):yb - ya)?32:yb - ya < 0?-(yb - ya):yb - ya);
  this.inductance = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.ratio = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.current_0 = initUnidimensionalArray(D_classLit, $intern_7, 5, 2, 15, 1);
  this.curcount = initUnidimensionalArray(D_classLit, $intern_7, 5, 2, 15, 1);
  this.current_0[0] = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.current_0[1] = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.couplingCoef = 0.999;
  try {
    this.couplingCoef = $doubleValue(__parseAndValidateDouble($nextToken(st)));
    this.saturationCurrent = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  }
   catch ($e0) {
    $e0 = toJava($e0);
    if (!instanceOf($e0, 9))
      throw toJs($e0);
  }
  this.polarity = (this.flags & 4) != 0?-1:1;
}

defineClass(86, 4, {4:1, 6:1, 86:1}, TransformerElm);
_.calculateCurrent = function calculateCurrent_27(){
  var voltdiff1, voltdiff2;
  voltdiff1 = this.volts[0] - this.volts[2];
  voltdiff2 = this.volts[1] - this.volts[3];
  this.current_0[0] = voltdiff1 * this.a1 + voltdiff2 * this.a2 + this.curSourceValue1;
  this.current_0[1] = voltdiff1 * this.a3 + voltdiff2 * this.a4 + this.curSourceValue2;
}
;
_.doStep = function doStep_33(){
  if (this.saturationCurrent > 0) {
    $stampConductance(this.nodes[0], this.nodes[2], this.a1);
    $stampVCCurrentSource(this.nodes[0], this.nodes[2], this.nodes[1], this.nodes[3], this.a2);
    $stampVCCurrentSource(this.nodes[1], this.nodes[3], this.nodes[0], this.nodes[2], this.a3);
    $stampConductance(this.nodes[1], this.nodes[3], this.a4);
  }
  $stampCurrentSource(this.nodes[0], this.nodes[2], this.curSourceValue1);
  $stampCurrentSource(this.nodes[1], this.nodes[3], this.curSourceValue2);
}
;
_.getConnection = function getConnection_22(n1, n2){
  if (n1 == 0 && n2 == 2 || n1 == 2 && n2 == 0)
    return true;
  if (n1 == 1 && n2 == 3 || n1 == 3 && n2 == 1)
    return true;
  return false;
}
;
_.getCurrentIntoNode = function getCurrentIntoNode_22(n){
  if (n < 2)
    return -this.current_0[n];
  return this.current_0[n - 2];
}
;
_.getDumpType = function getDumpType_64(){
  return 84;
}
;
_.getMatrixConnection = function getMatrixConnection_8(n1, n2){
  return true;
}
;
_.getPost = function getPost_18(n){
  return this.ptEnds[n];
}
;
_.getPostCount = function getPostCount_40(){
  return 4;
}
;
_.nonLinear_0 = function nonLinear_14(){
  return this.saturationCurrent > 0;
}
;
_.reset_0 = function reset_31(){
  this.current_0[0] = this.current_0[1] = this.volts[0] = this.volts[1] = this.volts[2] = this.volts[3] = this.curcount[0] = this.curcount[1] = this.curSourceValue1 = this.curSourceValue2 = 0;
}
;
_.setPoints = function setPoints_54(){
  var cd, ce, dotp, i, vsign, x_0;
  $setPoints(this);
  (this.flags & 8) != 0?(this.point2.x_0 = this.point1.x_0):(this.point2.y_0 = this.point1.y_0);
  this.ptEnds = $newPointArray(4);
  this.ptCoil = $newPointArray(4);
  this.ptCore = $newPointArray(4);
  this.ptEnds[0] = this.point1;
  this.ptEnds[1] = this.point2;
  this.flip = (this.flags & 16) != 0?-1:1;
  $interpPoint_2(this.point1, this.point2, this.ptEnds[2], 0, -this.dsign * this.width_0 * this.flip);
  $interpPoint_2(this.point1, this.point2, this.ptEnds[3], 1, -this.dsign * this.width_0 * this.flip);
  ce = 0.5 - 12 / this.dn;
  cd = 0.5 - 2 / this.dn;
  for (i = 0; i != 4; i += 2) {
    $interpPoint_1(this.ptEnds[i], this.ptEnds[i + 1], this.ptCoil[i], ce);
    $interpPoint_1(this.ptEnds[i], this.ptEnds[i + 1], this.ptCoil[i + 1], 1 - ce);
    $interpPoint_1(this.ptEnds[i], this.ptEnds[i + 1], this.ptCore[i], cd);
    $interpPoint_1(this.ptEnds[i], this.ptEnds[i + 1], this.ptCore[i + 1], 1 - cd);
  }
  if (this.polarity == -1) {
    vsign = (this.flags & 8) != 0?-1:1;
    this.dots = initUnidimensionalArray(Lcom_lushprojects_circuitjs1_client_Point_2_classLit, $intern_6, 11, 2, 0, 1);
    dotp = $wnd.Math.abs(7 / this.width_0);
    this.dots[0] = $interpPoint_0(this.ptCoil[0], this.ptCoil[2], dotp, -7 * this.dsign * vsign * this.flip);
    this.dots[1] = $interpPoint_0(this.ptCoil[3], this.ptCoil[1], dotp, -7 * this.dsign * vsign * this.flip);
    x_0 = this.ptEnds[1];
    this.ptEnds[1] = this.ptEnds[3];
    this.ptEnds[3] = x_0;
    x_0 = this.ptCoil[1];
    this.ptCoil[1] = this.ptCoil[3];
    this.ptCoil[3] = x_0;
  }
   else 
    this.dots = null;
}
;
_.stamp = function stamp_44(){
  var l1, l2, m;
  l1 = this.inductance;
  l2 = this.inductance * this.ratio * this.ratio;
  m = this.couplingCoef * $wnd.Math.sqrt(l1 * l2);
  $computeCoefficients(this, l1, l2, m);
  if (this.saturationCurrent > 0)
  ;
  else {
    $stampConductance(this.nodes[0], this.nodes[2], this.a1);
    $stampVCCurrentSource(this.nodes[0], this.nodes[2], this.nodes[1], this.nodes[3], this.a2);
    $stampVCCurrentSource(this.nodes[1], this.nodes[3], this.nodes[0], this.nodes[2], this.a3);
    $stampConductance(this.nodes[1], this.nodes[3], this.a4);
  }
}
;
_.startIteration = function startIteration_17(){
  var l1, l2, m, voltdiff1, voltdiff2;
  if (this.saturationCurrent > 0) {
    l1 = $calcEffectiveInductance_0(this.inductance, this.current_0[0], this.saturationCurrent);
    l2 = $calcEffectiveInductance_0(this.inductance * this.ratio * this.ratio, this.current_0[1], this.saturationCurrent * this.ratio);
    m = this.couplingCoef * $wnd.Math.sqrt(l1 * l2);
    $computeCoefficients(this, l1, l2, m);
  }
  voltdiff1 = this.volts[0] - this.volts[2];
  voltdiff2 = this.volts[1] - this.volts[3];
  if ((this.flags & 2) == 0) {
    this.curSourceValue1 = voltdiff1 * this.a1 + voltdiff2 * this.a2 + this.current_0[0];
    this.curSourceValue2 = voltdiff1 * this.a3 + voltdiff2 * this.a4 + this.current_0[1];
  }
   else {
    this.curSourceValue1 = this.current_0[0];
    this.curSourceValue2 = this.current_0[1];
  }
}
;
_.a1 = 0;
_.a2 = 0;
_.a3 = 0;
_.a4 = 0;
_.couplingCoef = 0;
_.curSourceValue1 = 0;
_.curSourceValue2 = 0;
_.flip = 0;
_.inductance = 0;
_.polarity = 0;
_.ratio = 0;
_.saturationCurrent = 0;
_.width_0 = 0;
var Lcom_lushprojects_circuitjs1_client_TransformerElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'TransformerElm', 86);
function $limitStep_0(this$static, vnew, vold){
  var arg;
  if (vnew > this$static.vcrit && $wnd.Math.abs(vnew - vold) > 0.05173) {
    if (vold > 0) {
      arg = 1 + (vnew - vold) / $intern_23;
      arg > 0?(vnew = vold + $intern_23 * $wnd.Math.log(arg)):(vnew = this$static.vcrit);
    }
     else {
      vnew = $intern_23 * $wnd.Math.log(vnew / $intern_23);
    }
    sim.converged = false;
  }
  return vnew;
}

function $setPoints_13(this$static){
  var hs2, pt;
  this$static.flags &= -3;
  this$static.flags |= globalFlags_0;
  $setPoints(this$static);
  (this$static.flags & 1) != 0 && (this$static.dsign = -this$static.dsign);
  hs2 = 16 * this$static.dsign * this$static.pnp;
  this$static.coll = $newPointArray(2);
  this$static.emit = $newPointArray(2);
  $interpPoint2(this$static.point1, this$static.point2, this$static.coll[0], this$static.emit[0], 1, hs2);
  this$static.rect = $newPointArray(4);
  $interpPoint2(this$static.point1, this$static.point2, this$static.rect[0], this$static.rect[1], 1 - 16 / this$static.dn, 16);
  $interpPoint2(this$static.point1, this$static.point2, this$static.rect[2], this$static.rect[3], 1 - 13 / this$static.dn, 16);
  $interpPoint2(this$static.point1, this$static.point2, this$static.coll[1], this$static.emit[1], 1 - 13 / this$static.dn, 6 * this$static.dsign * this$static.pnp);
  this$static.base = new Point;
  $interpPoint_1(this$static.point1, this$static.point2, this$static.base, 1 - 16 / this$static.dn);
  $createPolygon_0(this$static.rect[0], this$static.rect[2], this$static.rect[3], this$static.rect[1]);
  if (this$static.pnp == 1)
    $calcArrow(this$static.emit[1], this$static.emit[0], 8, 4);
  else {
    pt = $interpPoint_0(this$static.point1, this$static.point2, 1 - 11 / this$static.dn, -5 * this$static.dsign * this$static.pnp);
    $calcArrow(this$static.emit[0], pt, 8, 4);
  }
  $interpPoint(this$static.base, this$static.point2, 0.5);
}

function $setup_3(this$static){
  this$static.model = getModelWithNameOrCopy_0(this$static.modelName, this$static.model);
  this$static.modelName = this$static.model.name_0;
  this$static.vcrit = $intern_23 * $wnd.Math.log($intern_23 / ($wnd.Math.sqrt(2) * this$static.model.satCur));
}

function TransistorElm(xa, ya, xb, yb, f, st){
  CircuitElm.call(this, xa, ya, xb, yb, f);
  this.pnp = (new Integer_0($nextToken(st))).value_0;
  this.beta_0 = 100;
  try {
    this.lastvbe = $doubleValue(__parseAndValidateDouble($nextToken(st)));
    this.lastvbc = $doubleValue(__parseAndValidateDouble($nextToken(st)));
    this.volts[0] = 0;
    this.volts[1] = -this.lastvbe;
    this.volts[2] = -this.lastvbc;
    this.beta_0 = $doubleValue(__parseAndValidateDouble($nextToken(st)));
    this.modelName = unescape_0($nextToken(st));
  }
   catch ($e0) {
    $e0 = toJava($e0);
    if (instanceOf($e0, 9)) {
      this.modelName = 'default';
    }
     else 
      throw toJs($e0);
  }
  globalFlags_0 = this.flags & 2;
  $setup_3(this);
}

function calcJunctionCap(vj, cj0, vj0, mj){
  if (cj0 <= 0)
    return 0;
  return vj < 0.5 * vj0?cj0 / $wnd.Math.pow(1 - vj / vj0, mj):cj0 / $wnd.Math.pow(0.5, 1 + mj) * (1 - 0.5 * (1 + mj) + mj * vj / vj0);
}

defineClass(47, 4, {4:1, 6:1, 47:1}, TransistorElm);
_.doStep = function doStep_34(){
  var arg, c2, c4, cb, cbc, cbcn, cbe, cben, cc, ceqbc, ceqbe, csat, dqbdvc, dqbdve, evbc, evbcn, evbe, evben, gbc, gbcn, gbe, gben, gm, gmu, go, gpi, notConverged, oik, oikr, q1, q2, qb, sqarg, vbc, vbe, vtc, vte, vtn;
  vbc = this.pnp * (this.volts[0] - this.volts[1]);
  vbe = this.pnp * (this.volts[0] - this.volts[2]);
  notConverged = $wnd.Math.abs(vbc - this.lastvbc) > $intern_21 || $wnd.Math.abs(vbe - this.lastvbe) > $intern_21;
  notConverged && (sim.converged = false);
  notConverged?++this.localSubIters:(this.localSubIters = 0);
  this.gmin = 1.0E-12;
  if (this.localSubIters > 100 && this.badIters < 5) {
    this.gmin = $wnd.Math.exp(-9 * $wnd.Math.log(10) * (1 - this.localSubIters / 300));
    this.gmin > 0.1 && (this.gmin = 0.1);
  }
  vbc = $limitStep_0(this, vbc, this.lastvbc);
  vbe = $limitStep_0(this, vbe, this.lastvbe);
  this.lastvbc = vbc;
  this.lastvbe = vbe;
  csat = this.model.satCur;
  oik = this.model.invRollOffF;
  c2 = this.model.BEleakCur;
  vte = this.model.leakBEemissionCoeff * $intern_23;
  oikr = this.model.invRollOffR;
  c4 = this.model.BCleakCur;
  vtc = this.model.leakBCemissionCoeff * $intern_23;
  vtn = $intern_23 * this.model.emissionCoeffF;
  if (vbe > -5 * vtn) {
    evbe = $wnd.Math.exp(vbe / vtn);
    cbe = csat * (evbe - 1) + this.gmin * vbe;
    gbe = csat * evbe / vtn + this.gmin;
    if (c2 == 0) {
      cben = 0;
      gben = 0;
    }
     else {
      evben = $wnd.Math.exp(vbe / vte);
      cben = c2 * (evben - 1);
      gben = c2 * evben / vte;
    }
  }
   else {
    gbe = -csat / vbe + this.gmin;
    cbe = gbe * vbe;
    gben = -c2 / vbe;
    cben = gben * vbe;
  }
  vtn = $intern_23 * this.model.emissionCoeffR;
  if (vbc > -5 * vtn) {
    evbc = $wnd.Math.exp(vbc / vtn);
    cbc = csat * (evbc - 1) + this.gmin * vbc;
    gbc = csat * evbc / vtn + this.gmin;
    if (c4 == 0) {
      cbcn = 0;
      gbcn = 0;
    }
     else {
      evbcn = $wnd.Math.exp(vbc / vtc);
      cbcn = c4 * (evbcn - 1);
      gbcn = c4 * evbcn / vtc;
    }
  }
   else {
    gbc = -csat / vbc + this.gmin;
    cbc = gbc * vbc;
    gbcn = -c4 / vbc;
    cbcn = gbcn * vbc;
  }
  q1 = 1 / (1 - this.model.invEarlyVoltF * vbc - this.model.invEarlyVoltR * vbe);
  if (oik == 0 && oikr == 0) {
    qb = q1;
    dqbdve = q1 * q1 * this.model.invEarlyVoltR;
    dqbdvc = q1 * q1 * this.model.invEarlyVoltF;
  }
   else {
    q2 = oik * cbe + oikr * cbc;
    arg = $wnd.Math.max(0, 1 + 4 * q2);
    sqarg = 1;
    arg != 0 && (sqarg = $wnd.Math.sqrt(arg));
    qb = q1 * (1 + sqarg) / 2;
    dqbdve = q1 * (qb * this.model.invEarlyVoltR + oik * gbe / sqarg);
    dqbdvc = q1 * (qb * this.model.invEarlyVoltF + oikr * gbc / sqarg);
  }
  cc = 0;
  cc = cc + (cbe - cbc) / qb - cbc / this.model.betaR - cbcn;
  cb = cbe / this.beta_0 + cben + cbc / this.model.betaR + cbcn;
  this.ic = this.pnp * cc;
  this.ib = this.pnp * cb;
  this.ie = this.pnp * (-cc - cb);
  gpi = gbe / this.beta_0 + gben;
  gmu = gbc / this.model.betaR + gbcn;
  go = (gbc + (cbe - cbc) * dqbdvc / qb) / qb;
  gm = (gbe - (cbe - cbc) * dqbdve / qb) / qb - go;
  ceqbe = this.pnp * (cc + cb - vbe * (gm + go + gpi) + vbc * go);
  ceqbc = this.pnp * (-cc + vbe * (gm + go) - vbc * (gmu + go));
  (isInfinite(this.ib) || isNaN(this.ic)) && $stop(sim, 'infinite transistor current');
  $stampMatrix(this.nodes[1], this.nodes[1], gmu + go);
  $stampMatrix(this.nodes[1], this.nodes[0], -gmu + gm);
  $stampMatrix(this.nodes[1], this.nodes[2], -gm - go);
  $stampMatrix(this.nodes[0], this.nodes[0], gpi + gmu);
  $stampMatrix(this.nodes[0], this.nodes[2], -gpi);
  $stampMatrix(this.nodes[0], this.nodes[1], -gmu);
  $stampMatrix(this.nodes[2], this.nodes[0], -gpi - gm);
  $stampMatrix(this.nodes[2], this.nodes[1], -go);
  $stampMatrix(this.nodes[2], this.nodes[2], gpi + gm + go);
  $stampRightSide(this.nodes[0], -ceqbe - ceqbc);
  $stampRightSide(this.nodes[1], ceqbc);
  $stampRightSide(this.nodes[2], ceqbe);
  if (this.geqBE > 0) {
    $stampMatrix(this.nodes[0], this.nodes[0], this.geqBE);
    $stampMatrix(this.nodes[2], this.nodes[2], this.geqBE);
    $stampMatrix(this.nodes[0], this.nodes[2], -this.geqBE);
    $stampMatrix(this.nodes[2], this.nodes[0], -this.geqBE);
    $stampRightSide(this.nodes[0], -this.ceqBE);
    $stampRightSide(this.nodes[2], this.ceqBE);
  }
  if (this.geqBC > 0) {
    $stampMatrix(this.nodes[0], this.nodes[0], this.geqBC);
    $stampMatrix(this.nodes[1], this.nodes[1], this.geqBC);
    $stampMatrix(this.nodes[0], this.nodes[1], -this.geqBC);
    $stampMatrix(this.nodes[1], this.nodes[0], -this.geqBC);
    $stampRightSide(this.nodes[0], -this.ceqBC);
    $stampRightSide(this.nodes[1], this.ceqBC);
  }
}
;
_.getCurrentIntoNode = function getCurrentIntoNode_23(n){
  if (n == 0)
    return -this.ib;
  if (n == 1)
    return -this.ic;
  return -this.ie;
}
;
_.getDumpType = function getDumpType_65(){
  return 116;
}
;
_.getPost = function getPost_19(n){
  return n == 0?this.point1:n == 1?this.coll[0]:this.emit[0];
}
;
_.getPostCount = function getPostCount_41(){
  return 3;
}
;
_.nonLinear_0 = function nonLinear_15(){
  return true;
}
;
_.reset_0 = function reset_32(){
  this.volts[0] = this.volts[1] = this.volts[2] = 0;
  this.lastvbc = this.lastvbe = 0;
  this.capVoltBE = this.capVoltBC = this.capCurBE = this.capCurBC = 0;
  this.geqBE = this.geqBC = this.ceqBE = this.ceqBC = 0;
  this.badIters = 0;
  this.localSubIters = 0;
}
;
_.setPoints = function setPoints_55(){
  $setPoints_13(this);
}
;
_.stamp = function stamp_45(){
}
;
_.startIteration = function startIteration_18(){
  var cjc, cje, hasBCcap, hasBEcap, vjBC, vjBE, vtn;
  hasBEcap = this.model.junctionCapBE > 0 || this.model.transitTimeF > 0;
  hasBCcap = this.model.junctionCapBC > 0 || this.model.transitTimeR > 0;
  if (hasBEcap && sim.timeStep_0 > 0) {
    vjBE = this.pnp * this.capVoltBE;
    cje = calcJunctionCap(vjBE, this.model.junctionCapBE, this.model.junctionPotBE, this.model.junctionExpBE);
    if (this.model.transitTimeF > 0 && vjBE > 0) {
      vtn = $intern_23 * this.model.emissionCoeffF;
      cje += this.model.transitTimeF * this.model.satCur * $wnd.Math.exp(vjBE / vtn) / vtn;
    }
    this.geqBE = 2 * cje / sim.timeStep_0;
    this.geqBE < 1.0E-20?(this.geqBE = this.ceqBE = this.capCurBE = 0):(this.ceqBE = -this.geqBE * this.capVoltBE - this.capCurBE);
  }
  if (hasBCcap && sim.timeStep_0 > 0) {
    vjBC = this.pnp * this.capVoltBC;
    cjc = calcJunctionCap(vjBC, this.model.junctionCapBC, this.model.junctionPotBC, this.model.junctionExpBC);
    this.model.transitTimeR > 0 && vjBC > 0 && (cjc += this.model.transitTimeR * this.model.satCur * $wnd.Math.exp(vjBC / ($intern_23 * this.model.emissionCoeffR)) / ($intern_23 * this.model.emissionCoeffR));
    this.geqBC = 2 * cjc / sim.timeStep_0;
    this.geqBC < 1.0E-20?(this.geqBC = this.ceqBC = this.capCurBC = 0):(this.ceqBC = -this.geqBC * this.capVoltBC - this.capCurBC);
  }
}
;
_.stepFinished = function stepFinished_14(){
  var icapBC, icapBE;
  ($wnd.Math.abs(this.ic) > $intern_25 || $wnd.Math.abs(this.ib) > $intern_25) && $stop(sim, 'max current exceeded');
  this.localSubIters > 100?++this.badIters:(this.badIters = 0);
  if (this.geqBE > 0) {
    this.capVoltBE = this.volts[0] - this.volts[2];
    this.capCurBE = this.geqBE * this.capVoltBE + this.ceqBE;
  }
  if (this.geqBC > 0) {
    this.capVoltBC = this.volts[0] - this.volts[1];
    this.capCurBC = this.geqBC * this.capVoltBC + this.ceqBC;
  }
  if (this.geqBE > 0) {
    icapBE = this.geqBE * (this.volts[0] - this.volts[2]) + this.ceqBE;
    this.ib += icapBE;
    this.ie -= icapBE;
  }
  if (this.geqBC > 0) {
    icapBC = this.geqBC * (this.volts[0] - this.volts[1]) + this.ceqBC;
    this.ib += icapBC;
    this.ic -= icapBC;
  }
  this.localSubIters = 0;
}
;
_.badIters = 0;
_.beta_0 = 0;
_.capCurBC = 0;
_.capCurBE = 0;
_.capVoltBC = 0;
_.capVoltBE = 0;
_.ceqBC = 0;
_.ceqBE = 0;
_.geqBC = 0;
_.geqBE = 0;
_.gmin = 0;
_.ib = 0;
_.ic = 0;
_.ie = 0;
_.lastvbc = 0;
_.lastvbe = 0;
_.localSubIters = 0;
_.pnp = 0;
_.vcrit = 0;
var globalFlags_0 = 0;
var Lcom_lushprojects_circuitjs1_client_TransistorElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'TransistorElm', 47);
function $$init(this$static){
}

function $undump_0(this$static, st){
  this$static.flags = (new Integer_0($nextToken(st))).value_0;
  this$static.satCur = __parseAndValidateDouble($nextToken(st));
  this$static.invRollOffF = __parseAndValidateDouble($nextToken(st));
  this$static.BEleakCur = __parseAndValidateDouble($nextToken(st));
  this$static.leakBEemissionCoeff = __parseAndValidateDouble($nextToken(st));
  this$static.invRollOffR = __parseAndValidateDouble($nextToken(st));
  this$static.BCleakCur = __parseAndValidateDouble($nextToken(st));
  this$static.leakBCemissionCoeff = __parseAndValidateDouble($nextToken(st));
  this$static.emissionCoeffF = __parseAndValidateDouble($nextToken(st));
  this$static.emissionCoeffR = __parseAndValidateDouble($nextToken(st));
  this$static.invEarlyVoltF = __parseAndValidateDouble($nextToken(st));
  this$static.invEarlyVoltR = __parseAndValidateDouble($nextToken(st));
  this$static.betaR = __parseAndValidateDouble($nextToken(st));
  try {
    this$static.junctionCapBE = __parseAndValidateDouble($nextToken(st));
    this$static.junctionPotBE = __parseAndValidateDouble($nextToken(st));
    this$static.junctionExpBE = __parseAndValidateDouble($nextToken(st));
    this$static.junctionCapBC = __parseAndValidateDouble($nextToken(st));
    this$static.junctionPotBC = __parseAndValidateDouble($nextToken(st));
    this$static.junctionExpBC = __parseAndValidateDouble($nextToken(st));
  }
   catch ($e0) {
    $e0 = toJava($e0);
    if (!instanceOf($e0, 9))
      throw toJs($e0);
  }
  try {
    this$static.transitTimeF = __parseAndValidateDouble($nextToken(st));
    this$static.transitTimeR = __parseAndValidateDouble($nextToken(st));
  }
   catch ($e1) {
    $e1 = toJava($e1);
    if (!instanceOf($e1, 9))
      throw toJs($e1);
  }
}

function TransistorModel(){
  $$init(this);
}

function TransistorModel_0(copy){
  $$init(this);
  this.flags = copy.flags;
  this.satCur = copy.satCur;
  this.invRollOffF = copy.invRollOffF;
  this.BEleakCur = copy.BEleakCur;
  this.leakBEemissionCoeff = copy.leakBEemissionCoeff;
  this.invRollOffR = copy.invRollOffR;
  this.BCleakCur = copy.BCleakCur;
  this.leakBCemissionCoeff = copy.leakBCemissionCoeff;
  this.emissionCoeffF = copy.emissionCoeffF;
  this.emissionCoeffR = copy.emissionCoeffR;
  this.invEarlyVoltF = copy.invEarlyVoltF;
  this.invEarlyVoltR = copy.invEarlyVoltR;
  this.betaR = copy.betaR;
  this.junctionCapBE = copy.junctionCapBE;
  this.junctionPotBE = copy.junctionPotBE;
  this.junctionExpBE = copy.junctionExpBE;
  this.junctionCapBC = copy.junctionCapBC;
  this.junctionPotBC = copy.junctionPotBC;
  this.junctionExpBC = copy.junctionExpBC;
  this.transitTimeF = copy.transitTimeF;
  this.transitTimeR = copy.transitTimeR;
}

function TransistorModel_1(sc){
  $$init(this);
  this.satCur = sc;
  this.emissionCoeffF = this.emissionCoeffR = 1;
  this.leakBEemissionCoeff = 1.5;
  this.leakBCemissionCoeff = 2;
  this.betaR = 1;
  this.junctionCapBE = 0;
  this.junctionCapBC = 0;
  this.junctionPotBE = 0.75;
  this.junctionPotBC = 0.75;
  this.junctionExpBE = 0.33;
  this.junctionExpBC = 0.33;
  this.transitTimeF = 0;
  this.transitTimeR = 0;
}

function addDefaultModel_0(name_0, dm){
  $putStringValue(modelMap_0, name_0, dm);
  dm.name_0 = name_0;
}

function createModelMap_0(){
  var st, st0, st1, st10, st11, st12, st13, st14, st15, st16, st2, st3, st4, st5, st6, st7, st8, st9;
  if (modelMap_0)
    return;
  modelMap_0 = new HashMap;
  addDefaultModel_0('default', new TransistorModel_1(1.0E-13));
  addDefaultModel_0('spice-default', new TransistorModel_1(1.0E-16));
  st0 = new StringTokenizer('xlm324v2-qpi 0 1.01e-16 333.3333333333333 0 1.5 0 0 2 1 1 0.0034482758620689655 0 1');
  undumpModel(st0);
  st1 = new StringTokenizer('xlm324v2-qpi 0 1.01e-16 333.3333333333333 0 1.5 0 0 2 1 1 0.0034482758620689655 0 1');
  undumpModel(st1);
  st2 = new StringTokenizer('xlm324v2-qpa 0 1.01e-16 333.3333333333333 0 1.5 0 0 2 1 1 0.004081632653061225 0 1');
  undumpModel(st2);
  st3 = new StringTokenizer('xlm324v2-qnq 0 1e-16 200 0 1.5 0 0 2 1 1 0 0 1');
  undumpModel(st3);
  st4 = new StringTokenizer('xlm324v2-qpq 0 1e-16 333.3333333333333 0 1.5 0 0 2 1 1 0 0 1');
  undumpModel(st4);
  st5 = new StringTokenizer('~tl431ed-qn_ed 0 1e-16 0 0 1.5 0 0 2 1 1 0.0125 0.02 1');
  undumpModel(st5);
  st6 = new StringTokenizer('~tl431ed-qn_ed-A1.2 0 1.2e-16 0 0 1.5 0 0 2 1 1 0.0125 0.02 1');
  undumpModel(st6);
  st7 = new StringTokenizer('~tl431ed-qn_ed-A2.2 0 2.2000000000000002e-16 0 0 1.5 0 0 2 1 1 0.0125 0.02 1');
  undumpModel(st7);
  st8 = new StringTokenizer('~tl431ed-qn_ed-A0.5 0 5e-17 0 0 1.5 0 0 2 1 1 0.0125 0.02 1');
  undumpModel(st8);
  st9 = new StringTokenizer('~tl431ed-qp_ed 0 1e-16 0 0 1.5 0 0 2 1 1 0.014285714285714285 0.025 1');
  undumpModel(st9);
  st10 = new StringTokenizer('~tl431ed-qn_ed-A5 0 5e-16 0 0 1.5 0 0 2 1 1 0.0125 0.02 1');
  undumpModel(st10);
  st11 = new StringTokenizer('~lm317-qpl-A0.1 0 1e-17 0 0 1.5 0 0 2 1 1 0.02 0 1');
  undumpModel(st11);
  st12 = new StringTokenizer('~lm317-qnl-A0.2 0 2e-17 0 0 1.5 0 0 2 1 1 0.01 0 1');
  undumpModel(st12);
  st13 = new StringTokenizer('~lm317-qpl-A0.2 0 2e-17 0 0 1.5 0 0 2 1 1 0.02 0 1');
  undumpModel(st13);
  st14 = new StringTokenizer('~lm317-qnl-A2 0 2e-16 0 0 1.5 0 0 2 1 1 0.01 0 1');
  undumpModel(st14);
  st15 = new StringTokenizer('~lm317-qpl-A2 0 2e-16 0 0 1.5 0 0 2 1 1 0.02 0 1');
  undumpModel(st15);
  st16 = new StringTokenizer('~lm317-qnl-A5 0 5e-16 0 0 1.5 0 0 2 1 1 0.01 0 1');
  undumpModel(st16);
  st = new StringTokenizer('~lm317-qnl-A50 0 5e-15 0 0 1.5 0 0 2 1 1 0.01 0 1');
  undumpModel(st);
}

function getModelWithName_0(name_0){
  var lm;
  createModelMap_0();
  lm = castTo($getStringValue(modelMap_0, name_0), 48);
  if (lm)
    return lm;
  lm = new TransistorModel;
  lm.name_0 = name_0;
  $putStringValue(modelMap_0, name_0, lm);
  return lm;
}

function getModelWithNameOrCopy_0(name_0, oldmodel){
  var lm;
  createModelMap_0();
  lm = castTo($getStringValue(modelMap_0, name_0), 48);
  if (lm)
    return lm;
  if (!oldmodel) {
    console.log('model not found: ' + name_0);
    return getModelWithName_0('default');
  }
  lm = new TransistorModel_0(oldmodel);
  lm.name_0 = name_0;
  $putStringValue(modelMap_0, name_0, lm);
  return lm;
}

function undumpModel(st){
  var dm, name_0;
  name_0 = unescape_0($nextToken(st));
  dm = getModelWithName_0(name_0);
  $undump_0(dm, st);
  return dm;
}

defineClass(48, 1, {6:1, 48:1, 98:1}, TransistorModel, TransistorModel_0, TransistorModel_1);
_.BCleakCur = 0;
_.BEleakCur = 0;
_.betaR = 0;
_.emissionCoeffF = 0;
_.emissionCoeffR = 0;
_.flags = 0;
_.invEarlyVoltF = 0;
_.invEarlyVoltR = 0;
_.invRollOffF = 0;
_.invRollOffR = 0;
_.junctionCapBC = 0;
_.junctionCapBE = 0;
_.junctionExpBC = 0.33;
_.junctionExpBE = 0.33;
_.junctionPotBC = 0.75;
_.junctionPotBE = 0.75;
_.leakBCemissionCoeff = 0;
_.leakBEemissionCoeff = 0;
_.satCur = 0;
_.transitTimeF = 0;
_.transitTimeR = 0;
var modelMap_0;
var Lcom_lushprojects_circuitjs1_client_TransistorModel_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'TransistorModel', 48);
function TriacElm(xa, ya, xb, yb, f, st){
  CircuitElm.call(this, xa, ya, xb, yb, f);
  this.holdingI = 0.0082;
  this.triggerI = $intern_21;
  this.cresistance = 100;
  this.triggerI = __parseAndValidateDouble($nextToken(st));
  this.holdingI = __parseAndValidateDouble($nextToken(st));
  this.cresistance = __parseAndValidateDouble($nextToken(st));
  this.state = ($clinit_Boolean() , $equalsIgnoreCase($nextToken(st)));
  this.diode03 = new Diode(sim);
  $setup(this.diode03, getModelWithName('default'));
  this.diode30 = new Diode(sim);
  $setup(this.diode30, getModelWithName('default'));
}

defineClass(75, 4, {4:1, 6:1, 75:1}, TriacElm);
_.calculateCurrent = function calculateCurrent_28(){
  this.aresistance == 0?(this.i2 = 0):(this.i2 = (this.volts[3] - this.volts[1]) / this.aresistance);
  this.ig = -(this.volts[1] - this.volts[2]) / this.cresistance;
  this.i1 = -this.i2 - this.ig;
}
;
_.doStep = function doStep_35(){
  $doStep_0(this.diode03, this.volts[0] - this.volts[3]);
  $doStep_0(this.diode30, this.volts[3] - this.volts[0]);
  $stampResistor(this.nodes[3], this.nodes[1], this.aresistance);
}
;
_.getCurrent = function getCurrent_1(){
  return this.i2;
}
;
_.getCurrentIntoNode = function getCurrentIntoNode_24(n){
  if (n == 0)
    return -this.i2;
  if (n == 1)
    return -this.i1;
  return -this.ig;
}
;
_.getDumpType = function getDumpType_66(){
  return 206;
}
;
_.getInternalNodeCount = function getInternalNodeCount_9(){
  return 1;
}
;
_.getPost = function getPost_20(n){
  return n == 0?this.point1:n == 1?this.point2:this.gate[1];
}
;
_.getPostCount = function getPostCount_42(){
  return 3;
}
;
_.getVoltageDiff = function getVoltageDiff_21(){
  return this.volts[0] - this.volts[1];
}
;
_.nonLinear_0 = function nonLinear_16(){
  return true;
}
;
_.reset_0 = function reset_33(){
  this.volts[1] = this.volts[0] = this.volts[2] = 0;
  this.diode03.lastvoltdiff = 0;
  this.diode30.lastvoltdiff = 0;
}
;
_.setPoints = function setPoints_56(){
  var dir_0, gatelen, i, leadlen, p1, p2, p3, sgn;
  $setPoints(this);
  if (abs_0(this.dx) > abs_0(this.dy)) {
    dir_0 = -sign(this.dx) * sign(this.dy);
    this.dn = abs_0(this.dx);
    this.point2.y_0 = this.point1.y_0;
  }
   else {
    dir_0 = sign(this.dy) * sign(this.dx);
    this.dn = abs_0(this.dy);
    this.point2.x_0 = this.point1.x_0;
  }
  dir_0 == 0 && (dir_0 = 1);
  $calcLeads(this, 16);
  this.plate1 = $newPointArray(2);
  this.plate2 = $newPointArray(2);
  this.gate = $newPointArray(2);
  $interpPoint2(this.lead1, this.lead2, this.plate1[0], this.plate1[1], 0, 16);
  $interpPoint2(this.lead1, this.lead2, this.plate2[0], this.plate2[1], 1, 16);
  this.arrows = initUnidimensionalArray(Lcom_lushprojects_circuitjs1_client_Polygon_2_classLit, $intern_6, 74, 2, 0, 1);
  for (i = 0; i != 2; i++) {
    sgn = -1 + i * 2;
    p1 = $interpPoint_0(this.lead1, this.lead2, i, 8 * sgn);
    p2 = $interpPoint_0(this.lead1, this.lead2, 1 - i, 16 * sgn);
    p3 = $interpPoint_0(this.lead1, this.lead2, 1 - i, 0);
    this.arrows[i] = $createPolygon(p1, p2, p3);
  }
  gatelen = app.gridSize;
  leadlen = (this.dn - 16) / 2;
  gatelen = round_int(gatelen + leadlen % app.gridSize);
  if (leadlen < gatelen) {
    this.x2 = this.x_0;
    this.y2 = this.y_0;
    return;
  }
  $interpPoint_2(this.lead2, this.point2, this.gate[0], gatelen / leadlen, gatelen * dir_0);
  $interpPoint_2(this.lead2, this.point2, this.gate[1], gatelen / leadlen, app.gridSize * 2 * dir_0);
}
;
_.stamp = function stamp_46(){
  $stampResistor(this.nodes[2], this.nodes[1], this.cresistance);
  $stamp_0(this.diode03, this.nodes[0], this.nodes[3]);
  $stamp_0(this.diode30, this.nodes[3], this.nodes[0]);
}
;
_.startIteration = function startIteration_19(){
  $wnd.Math.abs(this.i2) < this.holdingI && (this.state = false);
  $wnd.Math.abs(this.ig) > this.triggerI && (this.state = true);
  this.aresistance = this.state?$intern_21:$intern_29;
}
;
_.aresistance = 0;
_.cresistance = 0;
_.holdingI = 0;
_.i1 = 0;
_.i2 = 0;
_.ig = 0;
_.state = false;
_.triggerI = 0;
var Lcom_lushprojects_circuitjs1_client_TriacElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'TriacElm', 75);
function TriodeElm(xa, ya, xb, yb, f, st){
  CircuitElm.call(this, xa, ya, xb, yb, f);
  this.mu = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.kg1 = $doubleValue(__parseAndValidateDouble($nextToken(st)));
}

defineClass(96, 4, {4:1, 6:1, 96:1}, TriodeElm);
_.doStep = function doStep_36(){
  var Gds, gm, ids, ival, q, rs, vgk, vpk, vs;
  vs = initUnidimensionalArray(D_classLit, $intern_7, 5, 3, 15, 1);
  vs[0] = this.volts[0];
  vs[1] = this.volts[1];
  vs[2] = this.volts[2];
  vs[1] > this.lastv1 + 0.5 && (vs[1] = this.lastv1 + 0.5);
  vs[1] < this.lastv1 - 0.5 && (vs[1] = this.lastv1 - 0.5);
  vs[2] > this.lastv2 + 0.5 && (vs[2] = this.lastv2 + 0.5);
  vs[2] < this.lastv2 - 0.5 && (vs[2] = this.lastv2 - 0.5);
  vgk = vs[1] - vs[2];
  vpk = vs[0] - vs[2];
  ($wnd.Math.abs(this.lastv0 - vs[0]) > $intern_21 || $wnd.Math.abs(this.lastv1 - vs[1]) > $intern_21 || $wnd.Math.abs(this.lastv2 - vs[2]) > $intern_21) && (sim.converged = false);
  this.lastv0 = vs[0];
  this.lastv1 = vs[1];
  this.lastv2 = vs[2];
  gm = 0;
  ival = vgk + vpk / this.mu;
  this.currentg = 0;
  if (vgk > $intern_21) {
    $stampResistor(this.nodes[1], this.nodes[2], 6000);
    this.currentg = vgk / 6000;
  }
   else 
    $stampResistor(this.nodes[1], this.nodes[2], $intern_19);
  if (ival < 0) {
    Gds = $intern_27;
    ids = vpk * $intern_27;
  }
   else {
    ids = $wnd.Math.pow(ival, 1.5) / this.kg1;
    q = 1.5 * $wnd.Math.sqrt(ival) / this.kg1;
    Gds = q;
    gm = q / this.mu;
  }
  this.currentp = ids;
  this.currentc = ids + this.currentg;
  rs = -ids + Gds * vpk + gm * vgk;
  $stampMatrix(this.nodes[0], this.nodes[0], Gds);
  $stampMatrix(this.nodes[0], this.nodes[2], -Gds - gm);
  $stampMatrix(this.nodes[0], this.nodes[1], gm);
  $stampMatrix(this.nodes[2], this.nodes[0], -Gds);
  $stampMatrix(this.nodes[2], this.nodes[2], Gds + gm);
  $stampMatrix(this.nodes[2], this.nodes[1], -gm);
  $stampRightSide(this.nodes[0], rs);
  $stampRightSide(this.nodes[2], -rs);
}
;
_.getConnection = function getConnection_23(n1, n2){
  return !(n1 == 1 || n2 == 1);
}
;
_.getCurrent = function getCurrent_2(){
  return this.currentc;
}
;
_.getCurrentIntoNode = function getCurrentIntoNode_25(n){
  if (n == 2)
    return this.currentc;
  if (n == 0)
    return -this.currentp;
  return -this.currentg;
}
;
_.getDumpType = function getDumpType_67(){
  return 173;
}
;
_.getMatrixConnection = function getMatrixConnection_9(n1, n2){
  return true;
}
;
_.getPost = function getPost_21(n){
  return n == 0?this.plate[0]:n == 1?this.grid[0]:this.cath[0];
}
;
_.getPostCount = function getPostCount_43(){
  return 3;
}
;
_.getVoltageDiff = function getVoltageDiff_22(){
  return this.volts[0] - this.volts[2];
}
;
_.nonLinear_0 = function nonLinear_17(){
  return true;
}
;
_.reset_0 = function reset_34(){
  this.volts[0] = this.volts[1] = this.volts[2] = 0;
}
;
_.setPoints = function setPoints_57(){
  var cathw, farw, i, nearw, s;
  $setPoints(this);
  s = (this.flags & 2) != 0?this.dsign:1;
  (this.flags & 1) != 0 && (s = -s);
  this.plate = $newPointArray(4);
  this.grid = $newPointArray(8);
  this.cath = $newPointArray(4);
  this.grid[0] = this.point1;
  nearw = 8 * s;
  $interpPoint_2(this.point1, this.point2, this.plate[1], 1, nearw);
  farw = 32 * s;
  $interpPoint_2(this.point1, this.point2, this.plate[0], 1, farw);
  $interpPoint2(this.point2, this.plate[1], this.plate[2], this.plate[3], 1, 18);
  this.circler = 24;
  $interpPoint_2(this.point1, this.point2, this.grid[1], (this.dn - this.circler) / this.dn, 0);
  for (i = 0; i != 3; i++) {
    $interpPoint_2(this.grid[1], this.point2, this.grid[2 + i * 2], (i * 3 + 1) / 4.5, 0);
    $interpPoint_2(this.grid[1], this.point2, this.grid[3 + i * 2], (i * 3 + 2) / 4.5, 0);
  }
  cathw = 16 * s;
  $interpPoint_0(this.point1, this.point2, 1, -nearw);
  $interpPoint2(this.point2, this.plate[1], this.cath[1], this.cath[2], -1, cathw);
  $interpPoint_2(this.point2, this.plate[1], this.cath[3], -1.2, -cathw);
  $interpPoint_2(this.point2, this.plate[1], this.cath[0], -farw / nearw, cathw);
}
;
_.stamp = function stamp_47(){
}
;
_.circler = 0;
_.currentc = 0;
_.currentg = 0;
_.currentp = 0;
_.kg1 = 0;
_.lastv0 = 0;
_.lastv1 = 0;
_.lastv2 = 0;
_.mu = 0;
var Lcom_lushprojects_circuitjs1_client_TriodeElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'TriodeElm', 96);
function $limitStep_1(vnew, vold){
  if (vnew > vold + 1)
    return vold + 1;
  if (vnew < vold - 1)
    return vold - 1;
  return vnew;
}

function TunnelDiodeElm(xa, ya, xb, yb, f){
  CircuitElm.call(this, xa, ya, xb, yb, f);
}

defineClass(168, 4, $intern_9, TunnelDiodeElm);
_.calculateCurrent = function calculateCurrent_29(){
  var i0, voltdiff;
  voltdiff = this.volts[0] - this.volts[1];
  i0 = $intern_35 * $wnd.Math.exp(-0.37);
  this.current_1 = $intern_36 * $wnd.Math.exp($intern_37) * ($wnd.Math.exp(voltdiff / 0.026) - 1) + $intern_36 * (voltdiff / 0.1) * $wnd.Math.exp(1 - voltdiff / 0.1) + $intern_35 * $wnd.Math.exp(voltdiff - 0.37) - i0;
}
;
_.doStep = function doStep_37(){
  var geq, i, i0, nc, voltdiff;
  voltdiff = this.volts[0] - this.volts[1];
  $wnd.Math.abs(voltdiff - this.lastvoltdiff) > $intern_21 && (sim.converged = false);
  voltdiff = $limitStep_1(voltdiff, this.lastvoltdiff);
  this.lastvoltdiff = voltdiff;
  i0 = $intern_35 * $wnd.Math.exp(-0.37);
  i = $intern_36 * $wnd.Math.exp($intern_37) * ($wnd.Math.exp(voltdiff / 0.026) - 1) + $intern_36 * (voltdiff / 0.1) * $wnd.Math.exp(1 - voltdiff / 0.1) + $intern_35 * $wnd.Math.exp(voltdiff - 0.37) - i0;
  geq = $intern_36 * $wnd.Math.exp($intern_37) * $wnd.Math.exp(voltdiff / 0.026) / 0.026 + $intern_36 * $wnd.Math.exp(1 - voltdiff / 0.1) / 0.1 - $wnd.Math.exp(1 - voltdiff / 0.1) * $intern_36 * voltdiff / 0.010000000000000002 + $wnd.Math.exp(voltdiff - 0.37) * $intern_35;
  nc = i - geq * voltdiff;
  $stampConductance(this.nodes[0], this.nodes[1], geq);
  $stampCurrentSource(this.nodes[0], this.nodes[1], nc);
}
;
_.getDumpType = function getDumpType_68(){
  return 175;
}
;
_.nonLinear_0 = function nonLinear_18(){
  return true;
}
;
_.reset_0 = function reset_35(){
  this.lastvoltdiff = this.volts[0] = this.volts[1] = 0;
}
;
_.setPoints = function setPoints_58(){
  var pa;
  $setPoints(this);
  $calcLeads(this, 16);
  this.cathode = $newPointArray(4);
  pa = $newPointArray(2);
  $interpPoint2(this.lead1, this.lead2, pa[0], pa[1], 0, 8);
  $interpPoint2(this.lead1, this.lead2, this.cathode[0], this.cathode[1], 1, 8);
  $interpPoint2(this.lead1, this.lead2, this.cathode[2], this.cathode[3], 0.8, 8);
  $createPolygon(pa[0], pa[1], this.lead2);
}
;
_.stamp = function stamp_48(){
}
;
_.lastvoltdiff = 0;
var Lcom_lushprojects_circuitjs1_client_TunnelDiodeElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'TunnelDiodeElm', 168);
function VarRailElm(xa, ya, xb, yb, st){
  RailElm.call(this, xa, ya, xb, yb, 0, st);
  this.sliderText = $nextToken(st);
  while ($hasMoreTokens(st))
    this.sliderText += ' ' + $nextToken(st);
  this.sliderText = $replaceAll(this.sliderText, '%2[bB]', '+');
  this.waveform = 7;
}

defineClass(32, 38, {4:1, 6:1, 38:1, 32:1, 20:1}, VarRailElm);
_.getDumpType = function getDumpType_69(){
  return 172;
}
;
_.getVoltage = function getVoltage_1(){
  return this.frequency;
}
;
var Lcom_lushprojects_circuitjs1_client_VarRailElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'VarRailElm', 32);
function VaractorElm(xa, ya, xb, yb, f, st){
  DiodeElm.call(this, xa, ya, xb, yb, f, st);
  this.capvoltdiff = $doubleValue(__parseAndValidateDouble($nextToken(st)));
  this.baseCapacitance = $doubleValue(__parseAndValidateDouble($nextToken(st)));
}

defineClass(76, 26, {4:1, 26:1, 6:1, 76:1}, VaractorElm);
_.calculateCurrent = function calculateCurrent_30(){
  this.current_1 = $calculateCurrent_0(this.diode, this.volts[0] - this.volts[this.diodeEndNode]);
  this.current_1 += this.capCurrent;
}
;
_.doStep = function doStep_38(){
  $doStep_0(this.diode, this.volts[0] - this.volts[this.diodeEndNode]);
  $stampResistor(this.nodes[2], this.nodes[1], this.compResistance);
  $updateVoltageSource(this.voltSource_0, this.voltSourceValue);
}
;
_.getDumpType = function getDumpType_70(){
  return 176;
}
;
_.getInternalNodeCount = function getInternalNodeCount_10(){
  return 1;
}
;
_.getVoltageSourceCount = function getVoltageSourceCount_28(){
  return 1;
}
;
_.reset_0 = function reset_36(){
  $reset_2(this);
  this.capvoltdiff = 0;
}
;
_.setCurrent = function setCurrent_9(vs, c){
  this.capCurrent = c;
}
;
_.setPoints = function setPoints_59(){
  var arrowPoint, pa;
  $setPoints_7(this);
  pa = $newPointArray(2);
  $interpPoint2(this.lead1, this.lead2, pa[0], pa[1], 0, 8);
  $interpPoint2(this.lead1, this.lead2, this.cathode_0[0], this.cathode_0[1], 0.6, 8);
  arrowPoint = $interpPoint(this.lead1, this.lead2, 0.6);
  $createPolygon(pa[0], pa[1], arrowPoint);
  this.plate1 = $newPointArray(2);
  this.plate2 = $newPointArray(2);
  $interpPoint2(this.lead1, this.lead2, this.plate1[0], this.plate1[1], 0.6, 8);
  $interpPoint2(this.lead1, this.lead2, this.plate2[0], this.plate2[1], 1, 8);
}
;
_.setVoltageSource = function setVoltageSource_12(n, v){
  this.voltSource_0 = v;
  $setNodes(v, this.nodes[0], this.nodes[2]);
}
;
_.stamp = function stamp_49(){
  $stamp_1(this);
  $stampVoltageSource(this.nodes[0], this.nodes[2], this.voltSource_0);
}
;
_.startIteration = function startIteration_20(){
  var c0;
  c0 = this.baseCapacitance;
  this.capvoltdiff > 0?(this.capacitance = c0):(this.capacitance = c0 / $wnd.Math.pow(1 - this.capvoltdiff / this.model.fwdrop, 0.5));
  this.compResistance = sim.timeStep_0 / (2 * this.capacitance);
  this.voltSourceValue = -this.capvoltdiff - this.capCurrent * this.compResistance;
}
;
_.stepFinished = function stepFinished_15(){
  this.capvoltdiff = this.volts[0] - this.volts[1];
}
;
_.baseCapacitance = 0;
_.capCurrent = 0;
_.capacitance = 0;
_.capvoltdiff = 0;
_.compResistance = 0;
_.voltSourceValue = 0;
var Lcom_lushprojects_circuitjs1_client_VaractorElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'VaractorElm', 76);
function $setNodes(this$static, n1, n2){
  this$static.n1 = n1;
  this$static.n2 = n2;
}

function VoltageSource(){
}

defineClass(34, 1, {34:1}, VoltageSource);
_.row = 0;
var Lcom_lushprojects_circuitjs1_client_VoltageSource_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'VoltageSource', 34);
function WattmeterElm(xa, ya, xb, yb, st){
  CircuitElm.call(this, xa, ya, xb, yb, 0);
  this.increasingP = true;
  this.decreasingP = true;
  this.width_0 = __parseAndValidateInt($nextToken(st), 10);
  try {
    this.meter = __parseAndValidateInt($nextToken(st), 10);
  }
   catch ($e0) {
    $e0 = toJava($e0);
    if (!instanceOf($e0, 9))
      throw toJs($e0);
  }
  this.voltSources = initUnidimensionalArray(Lcom_lushprojects_circuitjs1_client_VoltageSource_2_classLit, $intern_6, 34, 2, 0, 1);
  this.currents = initUnidimensionalArray(D_classLit, $intern_7, 5, 2, 15, 1);
}

defineClass(63, 4, {4:1, 6:1, 63:1}, WattmeterElm);
_.getConnection = function getConnection_24(n1, n2){
  return (n1 / 2 | 0) == (n2 / 2 | 0);
}
;
_.getCurrent = function getCurrent_3(){
  return this.currents[1];
}
;
_.getCurrentIntoNode = function getCurrentIntoNode_26(n){
  return n % 2 == 0?-this.currents[n / 2 | 0]:this.currents[n / 2 | 0];
}
;
_.getDumpType = function getDumpType_71(){
  return 420;
}
;
_.getPost = function getPost_22(n){
  return this.posts[n];
}
;
_.getPostCount = function getPostCount_44(){
  return 4;
}
;
_.getVoltageDiff = function getVoltageDiff_23(){
  return this.volts[2] - this.volts[0];
}
;
_.getVoltageSourceCount = function getVoltageSourceCount_29(){
  return 2;
}
;
_.hasGroundConnection = function hasGroundConnection_17(n1){
  return false;
}
;
_.setCurrent = function setCurrent_10(vs, c){
  this.currents[vs == this.voltSources[0]?0:1] = c;
}
;
_.setPoints = function setPoints_60(){
  var ds, p3, p4, r1, r4, sep;
  $setPoints(this);
  ds = this.dy == 0?sign(this.dx):-sign(this.dy);
  p3 = $interpPoint_0(this.point1, this.point2, 0, -this.width_0 * ds);
  p4 = $interpPoint_0(this.point1, this.point2, 1, -this.width_0 * ds);
  sep = app.gridSize;
  $interpPoint(this.point1, this.point2, sep / this.dn);
  $interpPoint(this.point1, this.point2, 1 - sep / this.dn);
  $interpPoint(p3, p4, sep / this.dn);
  $interpPoint(p3, p4, 1 - sep / this.dn);
  this.posts = stampJavaTypeInfo(getClassLiteralForArray(Lcom_lushprojects_circuitjs1_client_Point_2_classLit, 1), $intern_6, 11, 0, [p3, p4, this.point1, this.point2]);
  r1 = $interpPoint_0(this.point1, this.point2, sep / this.dn, ds * sep);
  $interpPoint_0(this.point1, this.point2, 1 - sep / this.dn, ds * sep);
  $interpPoint_0(this.point1, this.point2, sep / this.dn, -ds * (sep + this.width_0));
  r4 = $interpPoint_0(this.point1, this.point2, 1 - sep / this.dn, -ds * (sep + this.width_0));
  $interpPoint(r1, r4, 0.5);
  max_1(abs_0(r1.x_0 - r4.x_0) - 5, 5);
}
;
_.setVoltageSource = function setVoltageSource_13(j, vs){
  this.voltSources[j] = vs;
  $setNodes(vs, this.nodes[j * 2], this.nodes[j * 2 + 1]);
}
;
_.stamp = function stamp_50(){
  $stampVoltageSource_0(this.nodes[0], this.nodes[1], this.voltSources[0], 0);
  $stampVoltageSource_0(this.nodes[2], this.nodes[3], this.voltSources[1], 0);
}
;
_.stepFinished = function stepFinished_16(){
  var p;
  p = (this.volts[2] - this.volts[0]) * this.currents[1];
  ++this.count;
  this.totalPower += p;
  if (p > this.maxP && this.increasingP) {
    this.maxP = p;
    this.increasingP = true;
    this.decreasingP = false;
  }
  if (p < this.maxP && this.increasingP) {
    this.minP = p;
    this.increasingP = false;
    this.decreasingP = true;
    this.avgPower = this.totalPower / this.count;
    isNaN(this.avgPower) && (this.avgPower = 0);
    this.count = 0;
    this.totalPower = 0;
  }
  if (p < this.minP && this.decreasingP) {
    this.minP = p;
    this.increasingP = false;
    this.decreasingP = true;
  }
  if (p > this.minP && this.decreasingP) {
    this.maxP = p;
    this.increasingP = true;
    this.decreasingP = false;
    this.avgPower = this.totalPower / this.count;
    isNaN(this.avgPower) && (this.avgPower = 0);
    this.count = 0;
    this.totalPower = 0;
  }
  if (p == 0) {
    ++this.zerocount;
    if (this.zerocount > 5) {
      this.totalPower = 0;
      this.avgPower = 0;
      this.maxP = 0;
      this.minP = 0;
    }
  }
   else {
    this.zerocount = 0;
  }
}
;
_.avgPower = 0;
_.count = 0;
_.decreasingP = false;
_.increasingP = false;
_.maxP = 0;
_.meter = 0;
_.minP = 0;
_.totalPower = 0;
_.width_0 = 0;
_.zerocount = 0;
var Lcom_lushprojects_circuitjs1_client_WattmeterElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'WattmeterElm', 63);
function $getPost_0(this$static, n){
  if (this$static.busWidth == 1)
    return n == 0?this$static.point1:this$static.point2;
  if (n < this$static.busWidth)
    return new Point_1(this$static.point1.x_0, this$static.point1.y_0, n);
  return new Point_1(this$static.point2.x_0, this$static.point2.y_0, n - this$static.busWidth);
}

function WireElm(xa, ya, xb, yb, f){
  CircuitElm.call(this, xa, ya, xb, yb, f);
  this.busWidth = 1;
}

defineClass(99, 4, {4:1, 6:1, 99:1}, WireElm);
_.getBusWidth = function getBusWidth_1(){
  return this.busWidth;
}
;
_.getConnectedPost = function getConnectedPost_4(){
  return this.point2;
}
;
_.getConnectedPost_0 = function getConnectedPost_5(n){
  if (this.busWidth == 1)
    return n == 0?this.point2:this.point1;
  if (n < this.busWidth)
    return new Point_1(this.point2.x_0, this.point2.y_0, n);
  return new Point_1(this.point1.x_0, this.point1.y_0, n - this.busWidth);
}
;
_.getConnection = function getConnection_25(n1, n2){
  if (this.busWidth == 1)
    return true;
  return $wnd.Math.abs(n1 - n2) == this.busWidth;
}
;
_.getCurrentIntoNode = function getCurrentIntoNode_27(n){
  if (this.currents != null) {
    if (n < this.busWidth)
      return -this.currents[n];
    return this.currents[n - this.busWidth];
  }
  if (n == 0)
    return -this.current_1;
  return this.current_1;
}
;
_.getDumpType = function getDumpType_72(){
  return 119;
}
;
_.getPost = function getPost_23(n){
  return $getPost_0(this, n);
}
;
_.getPostCount = function getPostCount_45(){
  return this.busWidth * 2;
}
;
_.getPostWidth = function getPostWidth_4(n){
  return this.busWidth;
}
;
_.getVoltageDiff = function getVoltageDiff_24(){
  return this.volts[0];
}
;
_.isRemovableWire = function isRemovableWire_7(){
  return true;
}
;
_.isWireEquivalent = function isWireEquivalent_9(){
  return true;
}
;
_.setWireCurrent = function setWireCurrent_1(bit, c){
  this.currents != null?(this.currents[bit] = c):(this.current_1 = c);
}
;
_.stamp = function stamp_51(){
}
;
_.busWidth = 0;
var Lcom_lushprojects_circuitjs1_client_WireElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'WireElm', 99);
function XorGateElm(xa, ya, xb, yb, f, st){
  OrGateElm.call(this, xa, ya, xb, yb, f, st);
}

defineClass(87, 105, $intern_38, XorGateElm);
_.calcFunction = function calcFunction_1(){
  var f, i;
  f = false;
  for (i = 0; i != this.inputCount; i++)
    f = f ^ $getInput(this, i);
  return f;
}
;
_.getDumpType = function getDumpType_73(){
  return 154;
}
;
var Lcom_lushprojects_circuitjs1_client_XorGateElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'XorGateElm', 87);
function XnorGateElm(xa, ya, xb, yb, f, st){
  XorGateElm.call(this, xa, ya, xb, yb, f, st);
}

defineClass(141, 87, $intern_38, XnorGateElm);
_.getDumpType = function getDumpType_74(){
  return 431;
}
;
_.isInverting = function isInverting_2(){
  return true;
}
;
var Lcom_lushprojects_circuitjs1_client_XnorGateElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'XnorGateElm', 141);
function ZenerElm(xa, ya, xb, yb, f, st){
  var zvoltage;
  DiodeElm.call(this, xa, ya, xb, yb, f, st);
  if ((f & 2) == 0) {
    zvoltage = $doubleValue(__parseAndValidateDouble($nextToken(st)));
    this.model = getModelWithParameters(this.model.fwdrop, zvoltage);
    this.modelName = this.model.name_0;
    console_0('model name wparams = ' + this.modelName);
  }
  $setup_0(this);
}

defineClass(118, 26, $intern_24, ZenerElm);
_.getDumpType = function getDumpType_75(){
  return 122;
}
;
_.setPoints = function setPoints_61(){
  var pa;
  $setPoints_7(this);
  $calcLeads(this, 16);
  this.cathode = $newPointArray(2);
  this.wing = $newPointArray(2);
  pa = $newPointArray(2);
  $interpPoint2(this.lead1, this.lead2, pa[0], pa[1], 0, 8);
  $interpPoint2(this.lead1, this.lead2, this.cathode[0], this.cathode[1], 1, 8);
  $interpPoint_2(this.cathode[0], this.cathode[1], this.wing[0], -0.2, -8);
  $interpPoint_2(this.cathode[1], this.cathode[0], this.wing[1], -0.2, -8);
  $createPolygon(pa[0], pa[1], this.lead2);
}
;
var Lcom_lushprojects_circuitjs1_client_ZenerElm_2_classLit = createForClass('com.lushprojects.circuitjs1.client', 'ZenerElm', 118);
function DGrowArray(){
  this.data_0 = initUnidimensionalArray(D_classLit, $intern_7, 5, 0, 15, 1);
}

defineClass(114, 1, {}, DGrowArray);
var Lcom_lushprojects_circuitjs1_client_matrix_DGrowArray_2_classLit = createForClass('com.lushprojects.circuitjs1.client.matrix', 'DGrowArray', 114);
function $clinit_DMatrixSparseCSC(){
  $clinit_DMatrixSparseCSC = emptyMethod;
  EPS = $wnd.Math.pow(2, -52);
}

function $growMaxLength(this$static, arrayLength, preserveValue){
  var data_0, row_idx;
  if (arrayLength < 0)
    throw toJs(new IllegalArgumentException('Negative array length. Overflow?'));
  if (arrayLength > this$static.nz_values.length) {
    data_0 = initUnidimensionalArray(D_classLit, $intern_7, 5, arrayLength, 15, 1);
    row_idx = initUnidimensionalArray(I_classLit, $intern_12, 5, arrayLength, 15, 1);
    if (preserveValue) {
      arraycopy(this$static.nz_values, 0, data_0, 0, this$static.nz_length);
      arraycopy(this$static.nz_rows, 0, row_idx, 0, this$static.nz_length);
    }
    this$static.nz_values = data_0;
    this$static.nz_rows = row_idx;
  }
}

function $reshape(this$static, numRows, numCols, arrayLength){
  if (numRows < 0 || numCols < 0 || arrayLength < 0)
    throw toJs(new IllegalArgumentException('Rows, columns, and arrayLength must be not be negative'));
  this$static.numRows = numRows;
  this$static.numCols = numCols;
  $growMaxLength(this$static, arrayLength, false);
  this$static.nz_length = 0;
  numCols + 1 > this$static.col_idx.length?(this$static.col_idx = initUnidimensionalArray(I_classLit, $intern_12, 5, numCols + 1, 15, 1)):fill(this$static.col_idx, numCols + 1);
}

function DMatrixSparseCSC(numRows, numCols, arrayLength){
  $clinit_DMatrixSparseCSC();
  this.nz_values = initUnidimensionalArray(D_classLit, $intern_7, 5, 0, 15, 1);
  this.nz_rows = initUnidimensionalArray(I_classLit, $intern_12, 5, 0, 15, 1);
  if (numRows < 0 || numCols < 0 || arrayLength < 0)
    throw toJs(new IllegalArgumentException('Rows, columns, and arrayLength must be not be negative'));
  this.numRows = numRows;
  this.numCols = numCols;
  this.nz_length = 0;
  this.col_idx = initUnidimensionalArray(I_classLit, $intern_12, 5, numCols + 1, 15, 1);
  $growMaxLength(this, arrayLength, false);
}

function convert(circuitMatrix, tol){
  $clinit_DMatrixSparseCSC();
  var dst, i, i0, j, j0, nonzero, value_0;
  nonzero = 0;
  for (i0 = 0; i0 != circuitMatrix.length; i0++)
    for (j0 = 0; j0 != circuitMatrix.length; j0++) {
      circuitMatrix[i0][j0] != 0 && ++nonzero;
    }
  dst = new DMatrixSparseCSC(circuitMatrix.length, circuitMatrix.length, nonzero);
  dst.nz_length = 0;
  dst.col_idx[0] = 0;
  for (i = 0; i != circuitMatrix.length; i++) {
    for (j = 0; j != circuitMatrix.length; j++) {
      value_0 = circuitMatrix[j][i];
      if (!($wnd.Math.abs(value_0) <= tol)) {
        dst.nz_rows[dst.nz_length] = j;
        dst.nz_values[dst.nz_length] = value_0;
        ++dst.nz_length;
      }
    }
    dst.col_idx[i + 1] = dst.nz_length;
  }
  return dst;
}

defineClass(113, 1, {}, DMatrixSparseCSC);
_.numCols = 0;
_.numRows = 0;
_.nz_length = 0;
var EPS = 0;
var Lcom_lushprojects_circuitjs1_client_matrix_DMatrixSparseCSC_2_classLit = createForClass('com.lushprojects.circuitjs1.client.matrix', 'DMatrixSparseCSC', 113);
function IGrowArray(){
  this.data_0 = initUnidimensionalArray(I_classLit, $intern_12, 5, 0, 15, 1);
}

defineClass(115, 1, {}, IGrowArray);
var Lcom_lushprojects_circuitjs1_client_matrix_IGrowArray_2_classLit = createForClass('com.lushprojects.circuitjs1.client.matrix', 'IGrowArray', 115);
function $initialize(this$static, A){
  var i, m, n, o;
  m = A.numRows;
  n = A.numCols;
  o = $wnd.Math.min(m, n);
  $reshape(this$static.L, m, m, 4 * A.nz_length + o);
  this$static.L.nz_length = 0;
  $reshape(this$static.U, m, n, 4 * A.nz_length + o);
  this$static.U.nz_length = 0;
  if (this$static.pinv.length != m) {
    this$static.pinv = initUnidimensionalArray(I_classLit, $intern_12, 5, m, 15, 1);
    this$static.x_0 = initUnidimensionalArray(D_classLit, $intern_7, 5, m, 15, 1);
  }
  for (i = 0; i < m; ++i) {
    this$static.pinv[i] = -1;
    this$static.L.col_idx[i] = 0;
  }
}

function $performLU(this$static, A){
  var a, i, ipiv, k, m, n, p, p0, pivot, t, top_0, w, xi;
  m = A.numRows;
  n = A.numCols;
  w = adjust_0(this$static.gw, m * 2, m);
  for (k = 0; k < n; ++k) {
    this$static.L.col_idx[k] = this$static.L.nz_length;
    this$static.U.col_idx[k] = this$static.U.nz_length;
    this$static.L.nz_length + n > this$static.L.nz_values.length && $growMaxLength(this$static.L, 2 * this$static.L.nz_values.length + n, true);
    this$static.U.nz_length + n > this$static.U.nz_values.length && $growMaxLength(this$static.U, 2 * this$static.U.nz_values.length + n, true);
    top_0 = solveColB(this$static.L, A, k, this$static.x_0, this$static.pinv, this$static.gxi, w);
    xi = this$static.gxi.data_0;
    ipiv = -1;
    a = -1.7976931348623157E308;
    for (p0 = top_0; p0 < n; ++p0) {
      i = xi[p0];
      if (this$static.pinv[i] < 0) {
        if ((t = $wnd.Math.abs(this$static.x_0[i])) > a) {
          a = t;
          ipiv = i;
        }
      }
       else {
        this$static.U.nz_rows[this$static.U.nz_length] = this$static.pinv[i];
        this$static.U.nz_values[this$static.U.nz_length++] = this$static.x_0[i];
      }
    }
    if (ipiv == -1 || a <= 0) {
      return false;
    }
    pivot = this$static.x_0[ipiv];
    this$static.U.nz_rows[this$static.U.nz_length] = k;
    this$static.U.nz_values[this$static.U.nz_length++] = pivot;
    this$static.pinv[ipiv] = k;
    this$static.L.nz_rows[this$static.L.nz_length] = ipiv;
    this$static.L.nz_values[this$static.L.nz_length++] = 1;
    for (p = top_0; p < n; ++p) {
      i = xi[p];
      if (this$static.pinv[i] < 0) {
        this$static.L.nz_rows[this$static.L.nz_length] = i;
        this$static.L.nz_values[this$static.L.nz_length++] = this$static.x_0[i] / pivot;
      }
      this$static.x_0[i] = 0;
    }
  }
  this$static.L.col_idx[n] = this$static.L.nz_length;
  this$static.U.col_idx[n] = this$static.U.nz_length;
  for (k = 0; k < this$static.L.nz_length; ++k) {
    this$static.L.nz_rows[k] = this$static.pinv[this$static.L.nz_rows[k]];
  }
  return true;
}

function $setA(this$static, A){
  this$static.AnumRows = A.numRows;
  return $initialize(this$static, A) , $performLU(this$static, A);
}

function $solve(this$static, B, X){
  var L, U, b, i, i0, var10002, x_0;
  if (B.length != this$static.AnumRows) {
    var10002 = B.length;
    throw toJs(new IllegalArgumentException('Unexpected number of rows in B based on shape of A. Found=' + var10002 + ' Expected=' + this$static.AnumRows));
  }
  x_0 = adjust(this$static.gx, X.length);
  b = adjust(this$static.gb, B.length);
  L = this$static.L;
  U = this$static.U;
  for (i0 = 0; i0 < B.length; i0++) {
    b[i0] = B[i0];
  }
  permuteInv(this$static.pinv, b, x_0, X.length);
  solveL(L, x_0);
  solveU(U, x_0);
  for (i = 0; i < X.length; i++) {
    X[i] = x_0[i];
  }
}

function SparseLU(){
  this.gw = new IGrowArray;
  this.L = new DMatrixSparseCSC(0, 0, 0);
  this.U = new DMatrixSparseCSC(0, 0, 0);
  this.x_0 = initUnidimensionalArray(D_classLit, $intern_7, 5, 0, 15, 1);
  this.gxi = new IGrowArray;
  this.pinv = initUnidimensionalArray(I_classLit, $intern_12, 5, 0, 15, 1);
  this.gx = new DGrowArray;
  this.gb = new DGrowArray;
}

function adjust(gwork, desired){
  gwork.data_0.length < desired && (gwork.data_0 = initUnidimensionalArray(D_classLit, $intern_7, 5, desired, 15, 1));
  return gwork.data_0;
}

function adjust_0(gwork, desired, zeroToM){
  var w;
  w = (gwork.data_0.length < desired && (gwork.data_0 = initUnidimensionalArray(I_classLit, $intern_12, 5, desired, 15, 1)) , gwork.data_0);
  checkCriticalArrayBounds(zeroToM, w.length);
  fill0(w, zeroToM);
  return w;
}

function permuteInv(perm, input_0, output, N){
  var k;
  for (k = 0; k < N; ++k) {
    output[perm[k]] = input_0[k];
  }
}

function searchNzRowsInX(G, B, colB, pinv, xi, w){
  var X_rows, i, idx0, idx1, rowB, top_0;
  X_rows = G.numCols;
  if (xi.length < X_rows) {
    throw toJs(new IllegalArgumentException('xi must be at least G.numCols=' + G.numCols));
  }
   else if (w.length < 2 * X_rows) {
    throw toJs(new IllegalArgumentException('w must be at least 2*G.numCols in length (2*number of rows in X) and first N elements must be zero'));
  }
   else {
    idx0 = B.col_idx[colB];
    idx1 = B.col_idx[colB + 1];
    top_0 = X_rows;
    for (i = idx0; i < idx1; ++i) {
      rowB = B.nz_rows[i];
      rowB < X_rows && w[rowB] == 0 && (top_0 = searchNzRowsInX_DFS(rowB, G, top_0, pinv, xi, w));
    }
    for (i = top_0; i < X_rows; ++i) {
      w[xi[i]] = 0;
    }
    return top_0;
  }
}

function searchNzRowsInX_DFS(rowB, G, top_0, pinv, xi, w){
  var G_col, G_col_new, N, done, head, idx0, idx1, j, jrow;
  N = G.numCols;
  head = 0;
  xi[0] = rowB;
  while (head >= 0) {
    G_col = xi[head];
    G_col_new = pinv[G_col];
    if (w[G_col] == 0) {
      w[G_col] = 1;
      w[N + head] = G_col_new >= 0 && G_col_new < N?G.col_idx[G_col_new]:0;
    }
    done = true;
    idx0 = w[N + head];
    idx1 = G_col_new >= 0 && G_col_new < N?G.col_idx[G_col_new + 1]:0;
    for (j = idx0; j < idx1; ++j) {
      jrow = G.nz_rows[j];
      if (jrow < N && w[jrow] == 0) {
        w[N + head] = j + 1;
        ++head;
        xi[head] = jrow;
        done = false;
        break;
      }
    }
    if (done) {
      --head;
      --top_0;
      xi[top_0] = G_col;
    }
  }
  return top_0;
}

function solveColB(G, B, colB, x_0, pinv, g_xi, w){
  var J, X_rows, idxB0, idxB1, j, p, px, q, top_0, var10001, xi;
  X_rows = G.numCols;
  xi = (g_xi.data_0.length < X_rows && (g_xi.data_0 = initUnidimensionalArray(I_classLit, $intern_12, 5, X_rows, 15, 1)) , g_xi.data_0);
  top_0 = searchNzRowsInX(G, B, colB, pinv, xi, w);
  for (idxB0 = top_0; idxB0 < X_rows; ++idxB0) {
    x_0[xi[idxB0]] = 0;
  }
  idxB0 = B.col_idx[colB];
  idxB1 = B.col_idx[colB + 1];
  for (px = idxB0; px < idxB1; ++px) {
    x_0[B.nz_rows[px]] = B.nz_values[px];
  }
  for (px = top_0; px < X_rows; ++px) {
    j = xi[px];
    J = pinv[j];
    if (J >= 0) {
      x_0[j] /= G.nz_values[G.col_idx[J]];
      p = G.col_idx[J] + 1;
      q = G.col_idx[J + 1];
      while (p < q) {
        var10001 = G.nz_rows[p];
        x_0[var10001] -= G.nz_values[p] * x_0[j];
        ++p;
      }
    }
  }
  return top_0;
}

function solveL(L, x_0){
  var N, col, i, idx0, idx1, row, x_j;
  N = L.numCols;
  idx0 = L.col_idx[0];
  for (col = 0; col < N; ++col) {
    idx1 = L.col_idx[col + 1];
    x_j = x_0[col] /= L.nz_values[idx0];
    for (i = idx0 + 1; i < idx1; ++i) {
      row = L.nz_rows[i];
      x_0[row] -= L.nz_values[i] * x_j;
    }
    idx0 = idx1;
  }
}

function solveU(U, x_0){
  var N, col, i, idx0, idx1, row, x_j;
  N = U.numCols;
  idx1 = U.col_idx[N];
  for (col = N - 1; col >= 0; --col) {
    idx0 = U.col_idx[col];
    x_j = x_0[col] /= U.nz_values[idx1 - 1];
    for (i = idx0; i < idx1 - 1; ++i) {
      row = U.nz_rows[i];
      x_0[row] -= U.nz_values[i] * x_j;
    }
    idx1 = idx0;
  }
}

defineClass(171, 1, {}, SparseLU);
_.AnumRows = 0;
var Lcom_lushprojects_circuitjs1_client_matrix_SparseLU_2_classLit = createForClass('com.lushprojects.circuitjs1.client.matrix', 'SparseLU', 171);
function LS(s){
  var ix, sm;
  if (s == null)
    return null;
  if (s.length == 0) {
    return s;
  }
  sm = castToString($getStringValue(localizationMap, s));
  if (sm != null)
    return sm;
  ix = $indexOf_0(s, fromCodePoint(126));
  if (ix != s.length - 1)
    return s;
  s = s.substr(0, ix);
  sm = castToString($getStringValue(localizationMap, s));
  if (sm != null)
    return sm;
  return s;
}

var localizationMap;
function AbstractStringBuilder(string){
  this.string = string;
}

defineClass(121, 1, {134:1});
_.toString_0 = function toString_6(){
  return this.string;
}
;
var Ljava_lang_AbstractStringBuilder_2_classLit = createForClass('java.lang', 'AbstractStringBuilder', 121);
function IndexOutOfBoundsException(){
  RuntimeException.call(this);
}

function IndexOutOfBoundsException_0(message){
  RuntimeException_0.call(this, message);
}

defineClass(94, 25, $intern_0, IndexOutOfBoundsException, IndexOutOfBoundsException_0);
var Ljava_lang_IndexOutOfBoundsException_2_classLit = createForClass('java.lang', 'IndexOutOfBoundsException', 94);
function ArrayIndexOutOfBoundsException(){
  IndexOutOfBoundsException.call(this);
}

function ArrayIndexOutOfBoundsException_0(msg){
  IndexOutOfBoundsException_0.call(this, msg);
}

defineClass(130, 94, $intern_0, ArrayIndexOutOfBoundsException, ArrayIndexOutOfBoundsException_0);
var Ljava_lang_ArrayIndexOutOfBoundsException_2_classLit = createForClass('java.lang', 'ArrayIndexOutOfBoundsException', 130);
function ArrayStoreException(){
  RuntimeException.call(this);
}

function ArrayStoreException_0(message){
  RuntimeException_0.call(this, message);
}

defineClass(126, 25, $intern_0, ArrayStoreException, ArrayStoreException_0);
var Ljava_lang_ArrayStoreException_2_classLit = createForClass('java.lang', 'ArrayStoreException', 126);
function $clinit_Boolean(){
  $clinit_Boolean = emptyMethod;
}

function $booleanValue(this$static){
  return checkCriticalNotNull(this$static) , this$static;
}

booleanCastMap = {3:1, 98:1};
var Ljava_lang_Boolean_2_classLit = createForClass('java.lang', 'Boolean', 184);
function digit(c, radix){
  if (radix < 2 || radix > 36) {
    return -1;
  }
  if (c >= 48 && c < 48 + $wnd.Math.min(radix, 10)) {
    return c - 48;
  }
  if (c >= 97 && c < radix + 97 - 10) {
    return c - 97 + 10;
  }
  if (c >= 65 && c < radix + 65 - 10) {
    return c - 65 + 10;
  }
  return -1;
}

function ClassCastException(){
  RuntimeException_0.call(this, null);
}

defineClass(149, 25, $intern_0, ClassCastException);
var Ljava_lang_ClassCastException_2_classLit = createForClass('java.lang', 'ClassCastException', 149);
function __parseAndValidateDouble(s){
  floatRegex == null && (floatRegex = new RegExp('^\\s*[+-]?(NaN|Infinity|((\\d+\\.?\\d*)|(\\.\\d+))([eE][+-]?\\d+)?[dDfF]?)\\s*$'));
  if (!floatRegex.test(s)) {
    throw toJs(new NumberFormatException('For input string: "' + s + '"'));
  }
  return parseFloat(s);
}

function __parseAndValidateInt(s, radix){
  var i, isTooLow, length_0, startIndex, toReturn;
  if (s == null) {
    throw toJs(new NumberFormatException('null'));
  }
  if (radix < 2 || radix > 36) {
    throw toJs(new NumberFormatException('radix ' + radix + ' out of range'));
  }
  length_0 = s.length;
  startIndex = length_0 > 0 && (checkCriticalStringElementIndex(0, s.length) , s.charCodeAt(0) == 45 || (checkCriticalStringElementIndex(0, s.length) , s.charCodeAt(0) == 43))?1:0;
  for (i = startIndex; i < length_0; i++) {
    if (digit((checkCriticalStringElementIndex(i, s.length) , s.charCodeAt(i)), radix) == -1) {
      throw toJs(new NumberFormatException('For input string: "' + s + '"'));
    }
  }
  toReturn = parseInt(s, radix);
  isTooLow = toReturn < -2147483648;
  if (isNaN(toReturn)) {
    throw toJs(new NumberFormatException('For input string: "' + s + '"'));
  }
   else if (isTooLow || toReturn > 2147483647) {
    throw toJs(new NumberFormatException('For input string: "' + s + '"'));
  }
  return toReturn;
}

defineClass(107, 1, {3:1, 107:1});
var floatRegex;
var Ljava_lang_Number_2_classLit = createForClass('java.lang', 'Number', 107);
function $doubleValue(this$static){
  return checkCriticalNotNull(this$static) , this$static;
}

function isInfinite(x_0){
  return !isNaN(x_0) && !isFinite(x_0);
}

doubleCastMap = {3:1, 98:1, 107:1};
var Ljava_lang_Double_2_classLit = createForClass('java.lang', 'Double', 185);
function IllegalArgumentException(message){
  RuntimeException_0.call(this, message);
}

defineClass(7, 25, $intern_0, IllegalArgumentException);
var Ljava_lang_IllegalArgumentException_2_classLit = createForClass('java.lang', 'IllegalArgumentException', 7);
function IllegalStateException(s){
  RuntimeException_0.call(this, s);
}

defineClass(106, 25, $intern_0, IllegalStateException);
var Ljava_lang_IllegalStateException_2_classLit = createForClass('java.lang', 'IllegalStateException', 106);
function Integer(value_0){
  this.value_0 = value_0;
}

function Integer_0(s){
  this.value_0 = __parseAndValidateInt(s, 10);
}

function highestOneBit(i){
  var rtn;
  if (i < 0) {
    return -2147483648;
  }
   else if (i == 0) {
    return 0;
  }
   else {
    for (rtn = 1073741824; (rtn & i) == 0; rtn >>= 1)
    ;
    return rtn;
  }
}

function signum(i){
  return i == 0?0:i < 0?-1:1;
}

function toString_9(value_0, radix){
  var number;
  if (radix == 10 || radix < 2 || radix > 36) {
    return '' + value_0;
  }
  return number = value_0 , number.toString(radix);
}

function valueOf(i){
  var rebase, result;
  if (i > -129 && i < 128) {
    rebase = i + 128;
    result = ($clinit_Integer$BoxedValues() , boxedValues)[rebase];
    !result && (result = boxedValues[rebase] = new Integer(i));
    return result;
  }
  return new Integer(i);
}

defineClass(17, 107, {3:1, 98:1, 17:1, 107:1}, Integer, Integer_0);
_.equals_0 = function equals_2(o){
  return instanceOf(o, 17) && castTo(o, 17).value_0 == this.value_0;
}
;
_.hashCode_0 = function hashCode_2(){
  return this.value_0;
}
;
_.toString_0 = function toString_8(){
  return '' + this.value_0;
}
;
_.value_0 = 0;
var Ljava_lang_Integer_2_classLit = createForClass('java.lang', 'Integer', 17);
function $clinit_Integer$BoxedValues(){
  $clinit_Integer$BoxedValues = emptyMethod;
  boxedValues = initUnidimensionalArray(Ljava_lang_Integer_2_classLit, $intern_6, 17, 256, 0, 1);
}

var boxedValues;
function cosh(x_0){
  return ($wnd.Math.exp(x_0) + $wnd.Math.exp(-x_0)) / 2;
}

function sinh(x_0){
  return x_0 == 0?0:($wnd.Math.exp(x_0) - $wnd.Math.exp(-x_0)) / 2;
}

function tanh(x_0){
  var e2x;
  if (x_0 == 0) {
    return x_0;
  }
   else if (!isNaN(x_0) && !isFinite(x_0)) {
    return x_0 == 0 || isNaN(x_0)?x_0:x_0 < 0?-1:1;
  }
   else {
    e2x = $wnd.Math.exp(2 * x_0);
    return (e2x - 1) / (e2x + 1);
  }
}

defineClass(209, 1, {});
function NullPointerException(){
  RuntimeException.call(this);
}

function NullPointerException_0(message){
  RuntimeException_0.call(this, message);
}

defineClass(124, 108, $intern_0, NullPointerException, NullPointerException_0);
_.createError = function createError_0(msg){
  return new TypeError(msg);
}
;
var Ljava_lang_NullPointerException_2_classLit = createForClass('java.lang', 'NullPointerException', 124);
function NumberFormatException(message){
  IllegalArgumentException.call(this, message);
}

defineClass(82, 7, $intern_0, NumberFormatException);
var Ljava_lang_NumberFormatException_2_classLit = createForClass('java.lang', 'NumberFormatException', 82);
function $charAt(this$static, index_0){
  checkCriticalStringElementIndex(index_0, this$static.length);
  return this$static.charCodeAt(index_0);
}

function $compareTo(this$static, other){
  var a, b;
  a = (checkCriticalNotNull(this$static) , this$static);
  b = (checkCriticalNotNull(other) , other);
  return a == b?0:a < b?-1:1;
}

function $endsWith(this$static){
  var suffixlength;
  suffixlength = 'dt'.length;
  return $equals_0(this$static.substr(this$static.length - suffixlength, suffixlength), 'dt');
}

function $equals_0(this$static, other){
  return checkCriticalNotNull(this$static) , this$static === other;
}

function $equalsIgnoreCase(other){
  checkCriticalNotNull('true');
  if (other == null) {
    return false;
  }
  if ($equals_0('true', other)) {
    return true;
  }
  return 'true'.length == other.length && $equals_0('true'.toLowerCase(), other.toLowerCase());
}

function $indexOf(this$static, codePoint, startIndex){
  return $indexOf_1(this$static, fromCodePoint(codePoint), startIndex);
}

function $indexOf_0(this$static, str){
  return this$static.indexOf(str);
}

function $indexOf_1(this$static, str, startIndex){
  return this$static.indexOf(str, startIndex);
}

function $replace(this$static, from, to){
  var regex, replacement;
  regex = $replaceAll(from, '([/\\\\\\.\\*\\+\\?\\|\\(\\)\\[\\]\\{\\}$^])', '\\\\$1');
  replacement = $replaceAll($replaceAll(to, '\\\\', '\\\\\\\\'), '\\$', '\\\\$');
  return $replaceAll(this$static, regex, replacement);
}

function $replaceAll(this$static, regex, replace){
  replace = translateReplaceString(replace);
  return this$static.replace(new RegExp(regex, 'g'), replace);
}

function $split(this$static, regex, maxMatch){
  var compiled, count, lastNonEmpty, lastTrail, matchIndex, matchObj, out, trail;
  compiled = new RegExp(regex, 'g');
  out = initUnidimensionalArray(Ljava_lang_String_2_classLit, $intern_6, 2, 0, 6, 1);
  count = 0;
  trail = this$static;
  lastTrail = null;
  while (true) {
    matchObj = compiled.exec(trail);
    if (matchObj == null || trail == '' || count == maxMatch - 1 && maxMatch > 0) {
      out[count] = trail;
      break;
    }
     else {
      matchIndex = matchObj.index;
      out[count] = trail.substr(0, matchIndex);
      trail = $substring_0(trail, matchIndex + matchObj[0].length, trail.length);
      compiled.lastIndex = 0;
      if (lastTrail == trail) {
        out[count] = trail.substr(0, 1);
        trail = trail.substr(1);
      }
      lastTrail = trail;
      ++count;
    }
  }
  if (maxMatch == 0 && this$static.length > 0) {
    lastNonEmpty = out.length;
    while (lastNonEmpty > 0 && out[lastNonEmpty - 1] == '') {
      --lastNonEmpty;
    }
    lastNonEmpty < out.length && (out.length = lastNonEmpty);
  }
  return out;
}

function $startsWith(this$static, prefix){
  return $equals_0(this$static.substr(0, prefix.length), prefix);
}

function $substring(this$static, beginIndex){
  return this$static.substr(beginIndex);
}

function $substring_0(this$static, beginIndex, endIndex){
  return this$static.substr(beginIndex, endIndex - beginIndex);
}

function $trim(this$static){
  var end, length_0, start_0;
  length_0 = this$static.length;
  start_0 = 0;
  while (start_0 < length_0 && (checkCriticalStringElementIndex(start_0, this$static.length) , this$static.charCodeAt(start_0) <= 32)) {
    ++start_0;
  }
  end = length_0;
  while (end > start_0 && (checkCriticalStringElementIndex(end - 1, this$static.length) , this$static.charCodeAt(end - 1) <= 32)) {
    --end;
  }
  return start_0 > 0 || end < length_0?this$static.substr(start_0, end - start_0):this$static;
}

function fromCodePoint(codePoint){
  var hiSurrogate, loSurrogate;
  if (codePoint >= 65536) {
    hiSurrogate = 55296 + (codePoint - 65536 >> 10 & 1023) & 65535;
    loSurrogate = 56320 + (codePoint - 65536 & 1023) & 65535;
    return String.fromCharCode(hiSurrogate) + ('' + String.fromCharCode(loSurrogate));
  }
   else {
    return String.fromCharCode(codePoint & 65535);
  }
}

function translateReplaceString(replaceStr){
  var pos;
  pos = 0;
  while (0 <= (pos = replaceStr.indexOf('\\', pos))) {
    checkCriticalStringElementIndex(pos + 1, replaceStr.length);
    replaceStr.charCodeAt(pos + 1) == 36?(replaceStr = replaceStr.substr(0, pos) + '$' + $substring(replaceStr, ++pos)):(replaceStr = replaceStr.substr(0, pos) + ('' + $substring(replaceStr, ++pos)));
  }
  return replaceStr;
}

stringCastMap = {3:1, 134:1, 98:1, 2:1};
var Ljava_lang_String_2_classLit = createForClass('java.lang', 'String', 2);
function $append(this$static, x_0){
  this$static.string += '' + x_0;
  return this$static;
}

function $append_0(this$static, x_0){
  this$static.string += '' + x_0;
  return this$static;
}

function StringBuilder(){
  AbstractStringBuilder.call(this, '');
}

function StringBuilder_0(s){
  AbstractStringBuilder.call(this, (checkCriticalNotNull(s) , s));
}

defineClass(122, 121, {134:1}, StringBuilder, StringBuilder_0);
var Ljava_lang_StringBuilder_2_classLit = createForClass('java.lang', 'StringBuilder', 122);
function StringIndexOutOfBoundsException(message){
  IndexOutOfBoundsException_0.call(this, message);
}

defineClass(153, 94, $intern_0, StringIndexOutOfBoundsException);
var Ljava_lang_StringIndexOutOfBoundsException_2_classLit = createForClass('java.lang', 'StringIndexOutOfBoundsException', 153);
function arraycopy(src_0, srcOfs, dest, destOfs, len){
  var destArray, destComp, destEnd, destType, destlen, srcArray, srcComp, srcType, srclen;
  checkCriticalNotNull_0(src_0, 'src');
  checkCriticalNotNull_0(dest, 'dest');
  srcType = getClass__Ljava_lang_Class___devirtual$(src_0);
  destType = getClass__Ljava_lang_Class___devirtual$(dest);
  checkCriticalArrayType_0((srcType.modifiers & 4) != 0, 'srcType is not an array');
  checkCriticalArrayType_0((destType.modifiers & 4) != 0, 'destType is not an array');
  srcComp = srcType.componentType;
  destComp = destType.componentType;
  checkCriticalArrayType_0((srcComp.modifiers & 1) != 0?srcComp == destComp:(destComp.modifiers & 1) == 0, "Array types don't match");
  srclen = src_0.length;
  destlen = dest.length;
  if (srcOfs < 0 || destOfs < 0 || len < 0 || srcOfs + len > srclen || destOfs + len > destlen) {
    throw toJs(new IndexOutOfBoundsException);
  }
  if ((srcComp.modifiers & 1) == 0 && srcType != destType) {
    srcArray = castToArray(src_0);
    destArray = castToArray(dest);
    if (src_0 === dest && srcOfs < destOfs) {
      srcOfs += len;
      for (destEnd = destOfs + len; destEnd-- > destOfs;) {
        setCheck(destArray, destEnd, srcArray[--srcOfs]);
      }
    }
     else {
      for (destEnd = destOfs + len; destOfs < destEnd;) {
        setCheck(destArray, destOfs++, srcArray[srcOfs++]);
      }
    }
  }
   else 
    len > 0 && copy_0(src_0, srcOfs, dest, destOfs, len, true);
}

defineClass(213, 1, {});
function $addAll(this$static, c){
  var changed, e, e$iterator, old;
  checkCriticalNotNull(c);
  changed = false;
  for (e$iterator = new ArrayList$1(c.arrayList); e$iterator.i < e$iterator.this$01.array.length;) {
    e = $next_0(e$iterator);
    changed = changed | (old = $put(this$static.map_0, e, this$static) , old == null);
  }
  return changed;
}

function $advanceToFind(this$static, o){
  var e, iter;
  for (iter = this$static.iterator(); iter.hasNext_0();) {
    e = iter.next_0();
    if (maskUndefined(o) === maskUndefined(e) || o != null && equals_Ljava_lang_Object__Z__devirtual$(o, e)) {
      return true;
    }
  }
  return false;
}

function $containsAll(this$static, c){
  var e, e$iterator;
  checkCriticalNotNull(c);
  for (e$iterator = c.iterator(); e$iterator.hasNext_0();) {
    e = e$iterator.next_0();
    if (!this$static.contains(e)) {
      return false;
    }
  }
  return true;
}

function $toString_0(this$static){
  var e, e$iterator, joiner;
  joiner = new StringJoiner('[', ']');
  for (e$iterator = this$static.iterator(); e$iterator.hasNext_0();) {
    e = e$iterator.next_0();
    $add_1(joiner, e === this$static?'(this Collection)':e == null?'null':toString_2(e));
  }
  return !joiner.builder?joiner.emptyValue:joiner.suffix.length == 0?joiner.builder.string:joiner.builder.string + ('' + joiner.suffix);
}

defineClass(189, 1, {});
_.contains = function contains(o){
  return $advanceToFind(this, o);
}
;
_.toString_0 = function toString_10(){
  return $toString_0(this);
}
;
var Ljava_util_AbstractCollection_2_classLit = createForClass('java.util', 'AbstractCollection', 189);
function $containsEntry(this$static, entry){
  var key, ourValue, value_0;
  key = entry.getKey();
  value_0 = entry.getValue();
  ourValue = instanceOfString(key)?$getStringValue(this$static, key):getEntryValueOrNull($getEntry(this$static.hashCodeMap, key));
  if (!(maskUndefined(value_0) === maskUndefined(ourValue) || value_0 != null && equals_Ljava_lang_Object__Z__devirtual$(value_0, ourValue))) {
    return false;
  }
  if (ourValue == null && !(instanceOfString(key)?$hasStringValue(this$static, key):!!$getEntry(this$static.hashCodeMap, key))) {
    return false;
  }
  return true;
}

function $toString_1(this$static, o){
  return o === this$static?'(this Map)':o == null?'null':toString_2(o);
}

function getEntryValueOrNull(entry){
  return !entry?null:entry.getValue();
}

defineClass(188, 1, {132:1});
_.equals_0 = function equals_3(obj){
  var entry, entry$iterator, otherMap;
  if (obj === this) {
    return true;
  }
  if (!instanceOf(obj, 23)) {
    return false;
  }
  otherMap = castTo(obj, 132);
  if (this.hashCodeMap.size_0 + this.stringMap.size_0 != otherMap.hashCodeMap.size_0 + otherMap.stringMap.size_0) {
    return false;
  }
  for (entry$iterator = new AbstractHashMap$EntrySetIterator((new AbstractHashMap$EntrySet(otherMap)).this$01); entry$iterator.hasNext;) {
    entry = $next(entry$iterator);
    if (!$containsEntry(this, entry)) {
      return false;
    }
  }
  return true;
}
;
_.hashCode_0 = function hashCode_3(){
  return hashCode_8(new AbstractHashMap$EntrySet(this));
}
;
_.toString_0 = function toString_11(){
  var entry, entry$iterator, joiner;
  joiner = new StringJoiner('{', '}');
  for (entry$iterator = new AbstractHashMap$EntrySetIterator((new AbstractHashMap$EntrySet(this)).this$01); entry$iterator.hasNext;) {
    entry = $next(entry$iterator);
    $add_1(joiner, $toString_1(this, entry.getKey()) + '=' + $toString_1(this, entry.getValue()));
  }
  return !joiner.builder?joiner.emptyValue:joiner.suffix.length == 0?joiner.builder.string:joiner.builder.string + ('' + joiner.suffix);
}
;
var Ljava_util_AbstractMap_2_classLit = createForClass('java.util', 'AbstractMap', 188);
function $containsKey(this$static, key){
  return instanceOfString(key)?$hasStringValue(this$static, key):!!$getEntry(this$static.hashCodeMap, key);
}

function $get(this$static, key){
  return instanceOfString(key)?$getStringValue(this$static, key):getEntryValueOrNull($getEntry(this$static.hashCodeMap, key));
}

function $getStringValue(this$static, key){
  return key == null?getEntryValueOrNull($getEntry(this$static.hashCodeMap, null)):$get_1(this$static.stringMap, key);
}

function $hasStringValue(this$static, key){
  return key == null?!!$getEntry(this$static.hashCodeMap, null):$contains_1(this$static.stringMap, key);
}

function $put(this$static, key, value_0){
  return instanceOfString(key)?$putStringValue(this$static, key, value_0):$put_0(this$static.hashCodeMap, key, value_0);
}

function $putStringValue(this$static, key, value_0){
  return key == null?$put_0(this$static.hashCodeMap, null, value_0):$put_1(this$static.stringMap, key, value_0);
}

function $reset_7(this$static){
  this$static.hashCodeMap = new InternalHashCodeMap(this$static);
  this$static.stringMap = new InternalStringMap(this$static);
  structureChanged(this$static);
}

function $size(this$static){
  return this$static.hashCodeMap.size_0 + this$static.stringMap.size_0;
}

defineClass(109, 188, {132:1});
var Ljava_util_AbstractHashMap_2_classLit = createForClass('java.util', 'AbstractHashMap', 109);
defineClass(190, 189, {103:1});
_.equals_0 = function equals_4(o){
  var other;
  if (o === this) {
    return true;
  }
  if (!instanceOf(o, 103)) {
    return false;
  }
  other = castTo(o, 103);
  if (other.size_1() != this.size_1()) {
    return false;
  }
  return $containsAll(this, other);
}
;
_.hashCode_0 = function hashCode_4(){
  return hashCode_8(this);
}
;
var Ljava_util_AbstractSet_2_classLit = createForClass('java.util', 'AbstractSet', 190);
function $contains(this$static, o){
  if (instanceOf(o, 45)) {
    return $containsEntry(this$static.this$01, castTo(o, 45));
  }
  return false;
}

function AbstractHashMap$EntrySet(this$0){
  this.this$01 = this$0;
}

defineClass(57, 190, {103:1}, AbstractHashMap$EntrySet);
_.contains = function contains_0(o){
  return $contains(this, o);
}
;
_.iterator = function iterator_0(){
  return new AbstractHashMap$EntrySetIterator(this.this$01);
}
;
_.size_1 = function size_1(){
  return $size(this.this$01);
}
;
var Ljava_util_AbstractHashMap$EntrySet_2_classLit = createForClass('java.util', 'AbstractHashMap/EntrySet', 57);
function $computeHasNext(this$static){
  if (this$static.current_0.hasNext_0()) {
    return true;
  }
  if (this$static.current_0 != this$static.stringMapEntries) {
    return false;
  }
  this$static.current_0 = new InternalHashCodeMap$1(this$static.this$01.hashCodeMap);
  return this$static.current_0.hasNext_0();
}

function $next(this$static){
  var rv;
  checkStructuralChange(this$static.this$01, this$static);
  checkCriticalElement(this$static.hasNext);
  rv = castTo(this$static.current_0.next_0(), 45);
  this$static.hasNext = $computeHasNext(this$static);
  return rv;
}

function AbstractHashMap$EntrySetIterator(this$0){
  this.this$01 = this$0;
  this.stringMapEntries = new InternalStringMap$1(this.this$01.stringMap);
  this.current_0 = this.stringMapEntries;
  this.hasNext = $computeHasNext(this);
  this.$modCount = this$0.$modCount;
}

defineClass(58, 1, {}, AbstractHashMap$EntrySetIterator);
_.next_0 = function next_0(){
  return $next(this);
}
;
_.hasNext_0 = function hasNext(){
  return this.hasNext;
}
;
_.hasNext = false;
var Ljava_util_AbstractHashMap$EntrySetIterator_2_classLit = createForClass('java.util', 'AbstractHashMap/EntrySetIterator', 58);
defineClass(191, 189, {116:1});
_.equals_0 = function equals_5(o){
  var elem, elem$iterator, elemOther, iterOther, other;
  if (o === this) {
    return true;
  }
  if (!instanceOf(o, 116)) {
    return false;
  }
  other = castTo(o, 116);
  if (this.size_1() != other.size_1()) {
    return false;
  }
  iterOther = other.iterator();
  for (elem$iterator = this.iterator(); elem$iterator.hasNext_0();) {
    elem = elem$iterator.next_0();
    elemOther = iterOther.next_0();
    if (!(maskUndefined(elem) === maskUndefined(elemOther) || elem != null && equals_Ljava_lang_Object__Z__devirtual$(elem, elemOther))) {
      return false;
    }
  }
  return true;
}
;
_.hashCode_0 = function hashCode_5(){
  return hashCode_9(this);
}
;
_.iterator = function iterator_1(){
  return new AbstractList$IteratorImpl(this);
}
;
var Ljava_util_AbstractList_2_classLit = createForClass('java.util', 'AbstractList', 191);
function AbstractList$IteratorImpl(this$0){
  this.this$01 = this$0;
}

defineClass(157, 1, {}, AbstractList$IteratorImpl);
_.hasNext_0 = function hasNext_0(){
  return this.i < this.this$01.size_1();
}
;
_.next_0 = function next_1(){
  checkCriticalElement(this.i < this.this$01.size_1());
  return this.this$01.get_0(this.i++);
}
;
_.i = 0;
var Ljava_util_AbstractList$IteratorImpl_2_classLit = createForClass('java.util', 'AbstractList/IteratorImpl', 157);
function AbstractMap$1(this$0){
  this.this$01 = this$0;
}

defineClass(156, 190, {103:1}, AbstractMap$1);
_.contains = function contains_1(key){
  return $containsKey(this.this$01, key);
}
;
_.iterator = function iterator_2(){
  var outerIter;
  return outerIter = new AbstractHashMap$EntrySetIterator((new AbstractHashMap$EntrySet(this.this$01)).this$01) , new AbstractMap$1$1(outerIter);
}
;
_.size_1 = function size_2(){
  return $size(this.this$01);
}
;
var Ljava_util_AbstractMap$1_2_classLit = createForClass('java.util', 'AbstractMap/1', 156);
function AbstractMap$1$1(val$outerIter){
  this.val$outerIter2 = val$outerIter;
}

defineClass(125, 1, {}, AbstractMap$1$1);
_.hasNext_0 = function hasNext_1(){
  return this.val$outerIter2.hasNext;
}
;
_.next_0 = function next_2(){
  var entry;
  entry = $next(this.val$outerIter2);
  return entry.getKey();
}
;
var Ljava_util_AbstractMap$1$1_2_classLit = createForClass('java.util', 'AbstractMap/1/1', 125);
defineClass(154, 1, $intern_39);
_.equals_0 = function equals_6(other){
  var entry;
  if (!instanceOf(other, 45)) {
    return false;
  }
  entry = castTo(other, 45);
  return equals_8(this.key, entry.getKey()) && equals_8(this.value_0, entry.getValue());
}
;
_.getKey = function getKey(){
  return this.key;
}
;
_.getValue = function getValue(){
  return this.value_0;
}
;
_.hashCode_0 = function hashCode_6(){
  return hashCode_10(this.key) ^ hashCode_10(this.value_0);
}
;
_.setValue = function setValue(value_0){
  var oldValue;
  oldValue = this.value_0;
  this.value_0 = value_0;
  return oldValue;
}
;
_.toString_0 = function toString_12(){
  return this.key + '=' + this.value_0;
}
;
var Ljava_util_AbstractMap$AbstractEntry_2_classLit = createForClass('java.util', 'AbstractMap/AbstractEntry', 154);
function AbstractMap$SimpleEntry(key, value_0){
  this.key = key;
  this.value_0 = value_0;
}

defineClass(155, 154, $intern_39, AbstractMap$SimpleEntry);
var Ljava_util_AbstractMap$SimpleEntry_2_classLit = createForClass('java.util', 'AbstractMap/SimpleEntry', 155);
defineClass(192, 1, $intern_39);
_.equals_0 = function equals_7(other){
  var entry;
  if (!instanceOf(other, 45)) {
    return false;
  }
  entry = castTo(other, 45);
  return equals_8(this.val$entry2.value[0], entry.getKey()) && equals_8($getValue(this), entry.getValue());
}
;
_.hashCode_0 = function hashCode_7(){
  return hashCode_10(this.val$entry2.value[0]) ^ hashCode_10($getValue(this));
}
;
_.toString_0 = function toString_13(){
  return this.val$entry2.value[0] + '=' + $getValue(this);
}
;
var Ljava_util_AbstractMapEntry_2_classLit = createForClass('java.util', 'AbstractMapEntry', 192);
function $add(this$static, o){
  this$static.array[this$static.array.length] = o;
  return true;
}

function $addAll_0(this$static, c){
  var cArray, len;
  cArray = $toArray(c.arrayList);
  len = cArray.length;
  if (len == 0) {
    return false;
  }
  insertTo(this$static.array, this$static.array.length, cArray);
  return true;
}

function $get_0(this$static, index_0){
  checkCriticalElementIndex(index_0, this$static.array.length);
  return this$static.array[index_0];
}

function $indexOf_2(this$static, o, index_0){
  for (; index_0 < this$static.array.length; ++index_0) {
    if (equals_8(o, this$static.array[index_0])) {
      return index_0;
    }
  }
  return -1;
}

function $remove(this$static, index_0){
  var previous;
  previous = (checkCriticalElementIndex(index_0, this$static.array.length) , this$static.array[index_0]);
  removeFrom(this$static.array, index_0);
  return previous;
}

function $set(this$static, index_0, o){
  var previous;
  previous = (checkCriticalElementIndex(index_0, this$static.array.length) , this$static.array[index_0]);
  this$static.array[index_0] = o;
  return previous;
}

function $toArray(this$static){
  return clone(this$static.array, this$static.array.length);
}

function ArrayList(){
  this.array = initUnidimensionalArray(Ljava_lang_Object_2_classLit, $intern_6, 1, 0, 5, 1);
}

defineClass(127, 191, {3:1, 116:1}, ArrayList);
_.contains = function contains_2(o){
  return $indexOf_2(this, o, 0) != -1;
}
;
_.get_0 = function get_0(index_0){
  return $get_0(this, index_0);
}
;
_.iterator = function iterator_3(){
  return new ArrayList$1(this);
}
;
_.size_1 = function size_3(){
  return this.array.length;
}
;
var Ljava_util_ArrayList_2_classLit = createForClass('java.util', 'ArrayList', 127);
function $next_0(this$static){
  checkCriticalElement(this$static.i < this$static.this$01.array.length);
  this$static.last = this$static.i++;
  return this$static.this$01.array[this$static.last];
}

function ArrayList$1(this$0){
  this.this$01 = this$0;
}

defineClass(30, 1, {}, ArrayList$1);
_.hasNext_0 = function hasNext_2(){
  return this.i < this.this$01.array.length;
}
;
_.next_0 = function next_3(){
  return $next_0(this);
}
;
_.i = 0;
_.last = -1;
var Ljava_util_ArrayList$1_2_classLit = createForClass('java.util', 'ArrayList/1', 30);
function fill(a, toIndex){
  checkCriticalArrayBounds(toIndex, a.length);
  fill0(a, toIndex);
}

function fill0(a, toIndex){
  var i;
  for (i = 0; i < toIndex; ++i) {
    a[i] = 0;
  }
}

function hashCode_8(collection){
  var e, e$iterator, hashCode;
  hashCode = 0;
  for (e$iterator = collection.iterator(); e$iterator.hasNext_0();) {
    e = e$iterator.next_0();
    hashCode = hashCode + (e != null?hashCode__I__devirtual$(e):0);
    hashCode = hashCode | 0;
  }
  return hashCode;
}

function hashCode_9(list){
  var e, e$iterator, hashCode;
  hashCode = 1;
  for (e$iterator = list.iterator(); e$iterator.hasNext_0();) {
    e = e$iterator.next_0();
    hashCode = 31 * hashCode + (e != null?hashCode__I__devirtual$(e):0);
    hashCode = hashCode | 0;
  }
  return hashCode;
}

function checkStructuralChange(host, iterator){
  if (iterator.$modCount != host.$modCount) {
    throw toJs(new ConcurrentModificationException);
  }
}

function structureChanged(host){
  var modCount, modCountable;
  modCountable = host;
  modCount = modCountable.$modCount | 0;
  modCountable.$modCount = modCount + 1;
}

function ConcurrentModificationException(){
  RuntimeException.call(this);
}

defineClass(172, 25, $intern_0, ConcurrentModificationException);
var Ljava_util_ConcurrentModificationException_2_classLit = createForClass('java.util', 'ConcurrentModificationException', 172);
function $equals_1(value1, value2){
  return maskUndefined(value1) === maskUndefined(value2) || value1 != null && equals_Ljava_lang_Object__Z__devirtual$(value1, value2);
}

function HashMap(){
  $reset_7(this);
}

function HashMap_0(ignored){
  checkCriticalArgument(ignored >= 0, 'Negative initial capacity');
  checkCriticalArgument(true, 'Non-positive load factor');
  $reset_7(this);
}

defineClass(23, 109, {3:1, 23:1, 132:1}, HashMap, HashMap_0);
var Ljava_util_HashMap_2_classLit = createForClass('java.util', 'HashMap', 23);
function $add_0(this$static, o){
  var old;
  old = $put(this$static.map_0, o, this$static);
  return old == null;
}

function $contains_0(this$static, o){
  return $containsKey(this$static.map_0, o);
}

function HashSet(){
  this.map_0 = new HashMap;
}

function HashSet_0(c){
  this.map_0 = new HashMap_0(c.arrayList.array.length);
  $addAll(this, c);
}

defineClass(83, 190, {3:1, 83:1, 103:1}, HashSet, HashSet_0);
_.contains = function contains_3(o){
  return $contains_0(this, o);
}
;
_.iterator = function iterator_4(){
  var outerIter;
  return outerIter = new AbstractHashMap$EntrySetIterator((new AbstractHashMap$EntrySet((new AbstractMap$1(this.map_0)).this$01)).this$01) , new AbstractMap$1$1(outerIter);
}
;
_.size_1 = function size_4(){
  return $size(this.map_0);
}
;
var Ljava_util_HashSet_2_classLit = createForClass('java.util', 'HashSet', 83);
function $findEntryInChain(key, chain){
  var entry, entry$index, entry$max;
  for (entry$index = 0 , entry$max = chain.length; entry$index < entry$max; ++entry$index) {
    entry = chain[entry$index];
    if ($equals_1(key, entry.getKey())) {
      return entry;
    }
  }
  return null;
}

function $getChainOrEmpty(this$static, hashCode){
  var chain;
  chain = this$static.backingMap.get(hashCode);
  return chain == null?new Array:chain;
}

function $getEntry(this$static, key){
  var hashCode;
  return $findEntryInChain(key, $getChainOrEmpty(this$static, key == null?0:(hashCode = hashCode__I__devirtual$(key) , hashCode | 0)));
}

function $put_0(this$static, key, value_0){
  var chain, chain0, entry, hashCode, hashCode0;
  hashCode0 = key == null?0:(hashCode = hashCode__I__devirtual$(key) , hashCode | 0);
  chain0 = (chain = this$static.backingMap.get(hashCode0) , chain == null?new Array:chain);
  if (chain0.length == 0) {
    this$static.backingMap.set(hashCode0, chain0);
  }
   else {
    entry = $findEntryInChain(key, chain0);
    if (entry) {
      return entry.setValue(value_0);
    }
  }
  setCheck(chain0, chain0.length, new AbstractMap$SimpleEntry(key, value_0));
  ++this$static.size_0;
  structureChanged(this$static.host);
  return null;
}

function InternalHashCodeMap(host){
  this.backingMap = newJsMap();
  this.host = host;
}

defineClass(162, 1, {}, InternalHashCodeMap);
_.iterator = function iterator_5(){
  return new InternalHashCodeMap$1(this);
}
;
_.size_0 = 0;
var Ljava_util_InternalHashCodeMap_2_classLit = createForClass('java.util', 'InternalHashCodeMap', 162);
function InternalHashCodeMap$1(this$0){
  this.this$01 = this$0;
  this.chains = this.this$01.backingMap.entries();
  this.chain = new Array;
}

defineClass(128, 1, {}, InternalHashCodeMap$1);
_.next_0 = function next_4(){
  return this.lastEntry = this.chain[this.itemIndex++] , this.lastEntry;
}
;
_.hasNext_0 = function hasNext_3(){
  var current;
  if (this.itemIndex < this.chain.length) {
    return true;
  }
  current = this.chains.next();
  if (!current.done) {
    this.chain = current.value[1];
    this.itemIndex = 0;
    return true;
  }
  return false;
}
;
_.itemIndex = 0;
_.lastEntry = null;
var Ljava_util_InternalHashCodeMap$1_2_classLit = createForClass('java.util', 'InternalHashCodeMap/1', 128);
function $clinit_InternalJsMapFactory(){
  $clinit_InternalJsMapFactory = emptyMethod;
  jsMapCtor = getJsMapConstructor();
}

function canHandleObjectCreateAndProto(){
  if (!Object.create || !Object.getOwnPropertyNames) {
    return false;
  }
  var protoField = '__proto__';
  var map_0 = Object.create(null);
  if (map_0[protoField] !== undefined) {
    return false;
  }
  var keys_0 = Object.getOwnPropertyNames(map_0);
  if (keys_0.length != 0) {
    return false;
  }
  map_0[protoField] = 42;
  if (map_0[protoField] !== 42) {
    return false;
  }
  if (Object.getOwnPropertyNames(map_0).length == 0) {
    return false;
  }
  return true;
}

function getJsMapConstructor(){
  function isCorrectIterationProtocol(){
    try {
      return (new Map).entries().next().done;
    }
     catch (e) {
      return false;
    }
  }

  if (typeof Map === 'function' && Map.prototype.entries && isCorrectIterationProtocol()) {
    return Map;
  }
   else {
    return getJsMapPolyFill();
  }
}

function getJsMapPolyFill(){
  function Stringmap(){
    this.obj = this.createObject();
  }

  ;
  Stringmap.prototype.createObject = function(key){
    return Object.create(null);
  }
  ;
  Stringmap.prototype.get = function(key){
    return this.obj[key];
  }
  ;
  Stringmap.prototype.set = function(key, value_0){
    this.obj[key] = value_0;
  }
  ;
  Stringmap.prototype['delete'] = function(key){
    delete this.obj[key];
  }
  ;
  Stringmap.prototype.keys = function(){
    return Object.getOwnPropertyNames(this.obj);
  }
  ;
  Stringmap.prototype.entries = function(){
    var keys_0 = this.keys();
    var map_0 = this;
    var nextIndex = 0;
    return {next:function(){
      if (nextIndex >= keys_0.length)
        return {done:true};
      var key = keys_0[nextIndex++];
      return {value:[key, map_0.get(key)], done:false};
    }
    };
  }
  ;
  if (!canHandleObjectCreateAndProto()) {
    Stringmap.prototype.createObject = function(){
      return {};
    }
    ;
    Stringmap.prototype.get = function(key){
      return this.obj[':' + key];
    }
    ;
    Stringmap.prototype.set = function(key, value_0){
      this.obj[':' + key] = value_0;
    }
    ;
    Stringmap.prototype['delete'] = function(key){
      delete this.obj[':' + key];
    }
    ;
    Stringmap.prototype.keys = function(){
      var result = [];
      for (var key in this.obj) {
        key.charCodeAt(0) == 58 && result.push(key.substring(1));
      }
      return result;
    }
    ;
  }
  return Stringmap;
}

function newJsMap(){
  $clinit_InternalJsMapFactory();
  return new jsMapCtor;
}

var jsMapCtor;
function $contains_1(this$static, key){
  return !(this$static.backingMap.get(key) === undefined);
}

function $get_1(this$static, key){
  return this$static.backingMap.get(key);
}

function $put_1(this$static, key, value_0){
  var oldValue;
  oldValue = this$static.backingMap.get(key);
  this$static.backingMap.set(key, value_0 === undefined?null:value_0);
  if (oldValue === undefined) {
    ++this$static.size_0;
    structureChanged(this$static.host);
  }
   else {
    ++this$static.valueMod;
  }
  return oldValue;
}

function InternalStringMap(host){
  this.backingMap = newJsMap();
  this.host = host;
}

defineClass(163, 1, {}, InternalStringMap);
_.iterator = function iterator_6(){
  return new InternalStringMap$1(this);
}
;
_.size_0 = 0;
_.valueMod = 0;
var Ljava_util_InternalStringMap_2_classLit = createForClass('java.util', 'InternalStringMap', 163);
function InternalStringMap$1(this$0){
  this.this$01 = this$0;
  this.entries_0 = this.this$01.backingMap.entries();
  this.current_0 = this.entries_0.next();
}

defineClass(129, 1, {}, InternalStringMap$1);
_.next_0 = function next_5(){
  return this.last = this.current_0 , this.current_0 = this.entries_0.next() , new InternalStringMap$2(this.this$01, this.last, this.this$01.valueMod);
}
;
_.hasNext_0 = function hasNext_4(){
  return !this.current_0.done;
}
;
var Ljava_util_InternalStringMap$1_2_classLit = createForClass('java.util', 'InternalStringMap/1', 129);
function $getValue(this$static){
  if (this$static.this$01.valueMod != this$static.val$lastValueMod3) {
    return $get_1(this$static.this$01, this$static.val$entry2.value[0]);
  }
  return this$static.val$entry2.value[1];
}

function InternalStringMap$2(this$0, val$entry, val$lastValueMod){
  this.this$01 = this$0;
  this.val$entry2 = val$entry;
  this.val$lastValueMod3 = val$lastValueMod;
}

defineClass(164, 192, $intern_39, InternalStringMap$2);
_.getKey = function getKey_0(){
  return this.val$entry2.value[0];
}
;
_.getValue = function getValue_0(){
  return $getValue(this);
}
;
_.setValue = function setValue_0(object){
  return $put_1(this.this$01, this.val$entry2.value[0], object);
}
;
_.val$lastValueMod3 = 0;
var Ljava_util_InternalStringMap$2_2_classLit = createForClass('java.util', 'InternalStringMap/2', 164);
function NoSuchElementException(){
  RuntimeException.call(this);
}

defineClass(131, 25, $intern_0, NoSuchElementException);
var Ljava_util_NoSuchElementException_2_classLit = createForClass('java.util', 'NoSuchElementException', 131);
function equals_8(a, b){
  return maskUndefined(a) === maskUndefined(b) || a != null && equals_Ljava_lang_Object__Z__devirtual$(a, b);
}

function hashCode_10(o){
  return o != null?hashCode__I__devirtual$(o):0;
}

function $clinit_Random(){
  $clinit_Random = emptyMethod;
  var i, i0, twoToTheXMinus24Tmp, twoToTheXMinus48Tmp;
  twoToTheXMinus24 = initUnidimensionalArray(D_classLit, $intern_7, 5, 25, 15, 1);
  twoToTheXMinus48 = initUnidimensionalArray(D_classLit, $intern_7, 5, 33, 15, 1);
  twoToTheXMinus48Tmp = 1.52587890625E-5;
  for (i0 = 32; i0 >= 0; i0--) {
    twoToTheXMinus48[i0] = twoToTheXMinus48Tmp;
    twoToTheXMinus48Tmp *= 0.5;
  }
  twoToTheXMinus24Tmp = 1;
  for (i = 24; i >= 0; i--) {
    twoToTheXMinus24[i] = twoToTheXMinus24Tmp;
    twoToTheXMinus24Tmp *= 0.5;
  }
}

function $nextDouble(this$static){
  return $nextInternal(this$static, 26) * 1.4901161193847656E-8 + $nextInternal(this$static, 27) * 1.1102230246251565E-16;
}

function $nextInternal(this$static, bits){
  var carry, dval, h, hi, l, lo;
  hi = this$static.seedhi * $intern_40 + this$static.seedlo * 1502;
  lo = this$static.seedlo * $intern_40 + 11;
  carry = $wnd.Math.floor(lo * 5.9604644775390625E-8);
  hi += carry;
  lo -= carry * 16777216;
  hi %= 16777216;
  this$static.seedhi = hi;
  this$static.seedlo = lo;
  if (bits <= 24) {
    return $wnd.Math.floor(this$static.seedhi * twoToTheXMinus24[bits]);
  }
   else {
    h = this$static.seedhi * (1 << bits - 24);
    l = $wnd.Math.floor(this$static.seedlo * twoToTheXMinus48[bits]);
    dval = h + l;
    dval >= 2147483648 && (dval -= 4294967296);
    return dval;
  }
}

function Random(){
  $clinit_Random();
  this.seedhi = 1502;
  this.seedlo = $intern_40;
}

defineClass(136, 1, {}, Random);
_.seedhi = 0;
_.seedlo = 0;
var twoToTheXMinus24, twoToTheXMinus48;
var Ljava_util_Random_2_classLit = createForClass('java.util', 'Random', 136);
function $add_1(this$static, newElement){
  !this$static.builder?(this$static.builder = new StringBuilder_0(this$static.prefix)):$append_0(this$static.builder, this$static.delimiter);
  $append(this$static.builder, newElement);
  return this$static;
}

function StringJoiner(prefix, suffix){
  this.delimiter = ', ';
  this.prefix = prefix;
  this.suffix = suffix;
  this.emptyValue = this.prefix + ('' + this.suffix);
}

defineClass(123, 1, {}, StringJoiner);
_.toString_0 = function toString_14(){
  return !this.builder?this.emptyValue:this.suffix.length == 0?this.builder.string:this.builder.string + ('' + this.suffix);
}
;
var Ljava_util_StringJoiner_2_classLit = createForClass('java.util', 'StringJoiner', 123);
function $add_2(this$static, o){
  return $add(this$static.arrayList, o);
}

function $addElement(this$static, o){
  $add(this$static.arrayList, o);
}

function $elementAt(this$static, index_0){
  return checkArrayElementIndex(index_0, this$static.arrayList.array.length) , $get_0(this$static.arrayList, index_0);
}

function $firstElement(this$static){
  checkCriticalElement(this$static.arrayList.array.length != 0);
  return checkArrayElementIndex(0, this$static.arrayList.array.length) , $get_0(this$static.arrayList, 0);
}

function $get_2(this$static, index_0){
  checkArrayElementIndex(index_0, this$static.arrayList.array.length);
  return $get_0(this$static.arrayList, index_0);
}

function $lastElement(this$static){
  checkCriticalElement(this$static.arrayList.array.length != 0);
  return $get_2(this$static, this$static.arrayList.array.length - 1);
}

function $remove_0(this$static, index_0){
  checkArrayElementIndex(index_0, this$static.arrayList.array.length);
  return $remove(this$static.arrayList, index_0);
}

function Vector(){
  this.arrayList = new ArrayList;
}

function Vector_0(c){
  this.arrayList = new ArrayList;
  $addAll_0(this.arrayList, c);
}

function checkArrayElementIndex(index_0, size_0){
  if (index_0 < 0 || index_0 >= size_0) {
    throw toJs(new ArrayIndexOutOfBoundsException);
  }
}

defineClass(16, 191, {3:1, 116:1, 16:1}, Vector, Vector_0);
_.contains = function contains_4(elem){
  return $indexOf_2(this.arrayList, elem, 0) != -1;
}
;
_.get_0 = function get_1(index_0){
  return $get_2(this, index_0);
}
;
_.iterator = function iterator_7(){
  return new ArrayList$1(this.arrayList);
}
;
_.size_1 = function size_5(){
  return this.arrayList.array.length;
}
;
_.toString_0 = function toString_15(){
  return $toString_0(this.arrayList);
}
;
var Ljava_util_Vector_2_classLit = createForClass('java.util', 'Vector', 16);
function clone(array, toIndex){
  var result;
  result = array.slice(0, toIndex);
  return getElementTypeCategory(array) != 10 && stampJavaTypeInfo(getClass__Ljava_lang_Class___devirtual$(array), array.castableTypeMap, array.__elementTypeId$, getElementTypeCategory(array), result) , result;
}

function copy_0(src_0, srcOfs, dest, destOfs, len, overwrite){
  var batchEnd, batchStart, destArray, end, spliceArgs;
  if (src_0 === dest) {
    src_0 = src_0.slice(srcOfs, srcOfs + len);
    srcOfs = 0;
  }
  destArray = dest;
  for (batchStart = srcOfs , end = srcOfs + len; batchStart < end;) {
    batchEnd = $wnd.Math.min(batchStart + 10000, end);
    len = batchEnd - batchStart;
    spliceArgs = src_0.slice(batchStart, batchEnd);
    spliceArgs.splice(0, 0, destOfs, overwrite?len:0);
    Array.prototype.splice.apply(destArray, spliceArgs);
    batchStart = batchEnd;
    destOfs += len;
  }
}

function insertTo(array, index_0, values){
  copy_0(values, 0, array, index_0, values.length, false);
}

function removeFrom(array, index_0){
  array.splice(index_0, 1);
}

defineClass(211, 1, {});
function checkCriticalArgument(expression, errorMessage){
  if (!expression) {
    throw toJs(new IllegalArgumentException(errorMessage));
  }
}

function checkCriticalArrayBounds(end, length_0){
  if (0 > end) {
    throw toJs(new IllegalArgumentException('fromIndex: 0 > toIndex: ' + end));
  }
  if (end > length_0) {
    throw toJs(new ArrayIndexOutOfBoundsException_0('fromIndex: 0, toIndex: ' + end + ', length: ' + length_0));
  }
}

function checkCriticalArrayType(expression){
  if (!expression) {
    throw toJs(new ArrayStoreException);
  }
}

function checkCriticalArrayType_0(expression, errorMessage){
  if (!expression) {
    throw toJs(new ArrayStoreException_0(errorMessage));
  }
}

function checkCriticalElement(expression){
  if (!expression) {
    throw toJs(new NoSuchElementException);
  }
}

function checkCriticalElementIndex(index_0, size_0){
  if (index_0 < 0 || index_0 >= size_0) {
    throw toJs(new IndexOutOfBoundsException_0('Index: ' + index_0 + ', Size: ' + size_0));
  }
}

function checkCriticalNotNull(reference){
  if (reference == null) {
    throw toJs(new NullPointerException);
  }
  return reference;
}

function checkCriticalNotNull_0(reference, errorMessage){
  if (reference == null) {
    throw toJs(new NullPointerException_0(errorMessage));
  }
}

function checkCriticalStringElementIndex(index_0, size_0){
  if (index_0 < 0 || index_0 >= size_0) {
    throw toJs(new StringIndexOutOfBoundsException('Index: ' + index_0 + ', Size: ' + size_0));
  }
}

function checkCriticalType(expression){
  if (!expression) {
    throw toJs(new ClassCastException);
  }
}

function setPropertySafe(map_0, key, value_0){
  try {
    map_0[key] = value_0;
  }
   catch (ignored) {
  }
}

defineClass(208, 1, {});
function getHashCode(o){
  return o.$H || (o.$H = ++nextHashId);
}

var nextHashId = 0;
function $clinit_StringHashCache(){
  $clinit_StringHashCache = emptyMethod;
  back_0 = new Object_0;
  front = new Object_0;
}

function compute(str){
  var hashCode, i, n, nBatch;
  hashCode = 0;
  n = str.length;
  nBatch = n - 4;
  i = 0;
  while (i < nBatch) {
    hashCode = (checkCriticalStringElementIndex(i + 3, str.length) , str.charCodeAt(i + 3) + (checkCriticalStringElementIndex(i + 2, str.length) , 31 * (str.charCodeAt(i + 2) + (checkCriticalStringElementIndex(i + 1, str.length) , 31 * (str.charCodeAt(i + 1) + (checkCriticalStringElementIndex(i, str.length) , 31 * (str.charCodeAt(i) + 31 * hashCode)))))));
    hashCode = hashCode | 0;
    i += 4;
  }
  while (i < n) {
    hashCode = hashCode * 31 + $charAt(str, i++);
  }
  hashCode = hashCode | 0;
  return hashCode;
}

function getHashCode_0(str){
  $clinit_StringHashCache();
  var hashCode, key, result;
  key = ':' + str;
  result = front[key];
  if (result != null) {
    return round_int((checkCriticalNotNull(result) , result));
  }
  result = back_0[key];
  hashCode = result == null?compute(str):round_int((checkCriticalNotNull(result) , result));
  increment();
  front[key] = hashCode;
  return hashCode;
}

function increment(){
  if (count_0 == 256) {
    back_0 = front;
    front = new Object_0;
    count_0 = 0;
  }
  ++count_0;
}

var back_0, count_0 = 0, front;
var D_classLit = createForPrimitive('double', 'D');
var Z_classLit = createForPrimitive('boolean', 'Z');
var I_classLit = createForPrimitive('int', 'I');
var $entry = ($clinit_Impl() , entry_0);
var gwtOnLoad = gwtOnLoad = gwtOnLoad_0;
addInitFunctions(init);
setGwtProperty('permProps', [[['locale', 'default'], ['user.agent', 'safari']]]);

gwtOnLoad(null,$moduleName,$moduleBase,0);
})();
