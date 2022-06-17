#include <emscripten/emscripten.h>

EMSCRIPTEN_KEEPALIVE int life() {
    return 42;
}