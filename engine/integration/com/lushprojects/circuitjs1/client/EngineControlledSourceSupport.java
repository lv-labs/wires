package com.lushprojects.circuitjs1.client;

/** Keeps controlled-source evaluation and history in Falstad's native models. */
final class EngineControlledSourceSupport {
    static VCCSElm construct(String[] fields, int x, int y, int x2, int y2, int flags) {
        String type = fields[0];
        if (!type.equals("212") && !type.equals("213") && !type.equals("214") && !type.equals("215"))
            return null;
        EngineOutputSupport.require(fields.length == 8 && flags == 0 && y == 32 && y2 == 32 && x2-x == 64,
            "Invalid controlled-source fields, geometry or flags");
        int inputCount = EngineOutputSupport.integer(fields, 6, 0, 8);
        EngineOutputSupport.require((!type.equals("214") && !type.equals("215")) || inputCount % 2 == 0,
            "Current sensing requires pairs of input terminals");
        String expression = EngineOutputSupport.decode(fields[7]);
        EngineOutputSupport.require(expression.length() <= 512 && expression.matches("[ -~]*"),
            "Invalid controlled-source expression text");
        int depth = 0;
        for (int i = 0; i < expression.length(); i++) {
            char c = expression.charAt(i);
            if (c == '(') {
                depth++;
                EngineOutputSupport.require(depth <= 32, "Controlled-source expression is nested too deeply");
            } else if (c == ')') {
                depth--;
            }
        }
        ExprParser parser = new ExprParser(expression);
        Expr parsed = parser.parseExpression();
        EngineOutputSupport.require(parser.gotError() == null, "Invalid controlled-source expression: " + parser.gotError());
        validateExpression(parsed);

        StringTokenizer args = new StringTokenizer(inputCount + " " + CustomLogicModel.escape(expression));
        if (type.equals("212")) return new VCVSElm(x, y, x2, y2, flags, args);
        if (type.equals("213")) return new VCCSElm(x, y, x2, y2, flags, args);
        if (type.equals("214")) return new CCVSElm(x, y, x2, y2, flags, args);
        return new CCCSElm(x, y, x2, y2, flags, args);
    }

    private static void validateExpression(Expr expr) {
        if (expr.type == Expr.E_VAL)
            EngineOutputSupport.require(EngineOutputSupport.finite(expr.value), "Non-finite expression constant");
        if (expr.type == Expr.E_PWL)
            EngineOutputSupport.require(expr.children.size() >= 5 && expr.children.size() % 2 == 1,
                "pwl requires an input and at least two coordinate pairs");
        if (expr.children != null)
            for (Expr child : expr.children) validateExpression(child);
    }

    static void configure(VCCSElm old, VCCSElm fresh) {
        if (old.inputCount != fresh.inputCount) {
            old.inputCount = fresh.inputCount;
            old.setupPins();
        }
        old.expr = fresh.expr;
        old.exprString = fresh.exprString;
    }
}
