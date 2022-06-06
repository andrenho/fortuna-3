#include <emscripten/emscripten.h>

EMSCRIPTEN_KEEPALIVE int life_meaning(int n) {
    return n + 21;
}
