#include "emscripten.h"
#include <string>
#include "src/Image.h"
#include "src/Effects.h"
#include "src/Icons.h"

//emcc -O3 -s WASM=1 -std=c++14 -s ALLOW_MEMORY_GROWTH=1 -s EXTRA_EXPORTED_RUNTIME_METHODS='["cwrap"]' -I src imod-wasm.cpp src/*.cpp
// emrun --no_browser --port 8080 .

extern "C" {
EMSCRIPTEN_KEEPALIVE
int version() 
{
  return 12;
}

EMSCRIPTEN_KEEPALIVE
uint8_t* create_buffer(int width, int height) {
  return new uint8_t[width * height * 4 * sizeof(uint8_t)];
}

EMSCRIPTEN_KEEPALIVE
void destroy_buffer(uint8_t* p) {
  delete[] p;
}

int result[2];
EMSCRIPTEN_KEEPALIVE
int green(uint8_t* img_in, int width, int height, int ch)
{
	Image i;
	i.Load(img_in, width, height, ch);
	Effects::Apply(i, EffectName::Effect1);
    result[0] = (int)i.Data();
    result[1] = i.Size();
	return i.W();
}


EMSCRIPTEN_KEEPALIVE
int get_result_pointer() {
  return result[0];
}

EMSCRIPTEN_KEEPALIVE
int get_result_size() {
  return result[1];
}

}
